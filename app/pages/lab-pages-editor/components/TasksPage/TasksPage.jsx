import { useRef, useState } from 'react'
import { useWorkflowContext } from '../../context.js';
import checkCanStepBranch from '../../helpers/checkCanStepBranch.js';
import createStep from '../../helpers/createStep.js';
import createTask from '../../helpers/createTask.js';
import getNewStepKey from '../../helpers/getNewStepKey.js';
import getNewTaskKey from '../../helpers/getNewTaskKey.js';
import linkStepsInWorkflow from '../../helpers/linkStepsInWorkflow.js';
import moveItemInArray from '../../helpers/moveItemInArray.js';
import cleanupTasksAndSteps from '../../helpers/cleanupTasksAndSteps.js';
// import strings from '../../strings.json'; // TODO: move all text into strings

import ExperimentalPanel from './ExperimentalPanel.jsx';
import EditStepDialog from './components/EditStepDialog';
import NewTaskDialog from './components/NewTaskDialog.jsx';
import StepItem from './components/StepItem';
import WorkflowVersion from '../WorkflowVersion.jsx';
import WrenchIcon from '../../icons/WrenchIcon.jsx';

// Use ?advanced=true to enable advanced mode.
// - switches from simpler "linear workflow" to "manual workflow".
// - enables Experimental Panel.
// - shows hidden options in workflow settings.
function getAdvancedMode() {
  const params = new URLSearchParams(window?.location?.search);
  return !!params.get('advanced');
}

export default function TasksPage() {
  const { workflow, update } = useWorkflowContext();
  const editStepDialog = useRef(null);
  const newTaskDialog = useRef(null);
  const [ activeStepIndex, setActiveStepIndex ] = useState(-1);  // Tracks which Step is being edited.
  const [ activeDragItem, setActiveDragItem ] = useState(-1);  // Keeps track of active item being dragged (StepItem). This is because "dragOver" CAN'T read the data from dragEnter.dataTransfer.getData().
  const firstStepKey = workflow?.steps?.[0]?.[0] || '';
  const isActive = true; // TODO
  const advancedMode = getAdvancedMode();

  // A linear workflow means every step (except branching steps) will move into
  // the next step in the workflow.steps array. e.g. step0.next = step1 
  // A manual (i.e. non-linear) workflow asks the user to explicity spell out
  // the next step of each step. 
  const isLinearWorkflow = !advancedMode;

  /*
  Adds a new Task of a specified type (with default settings) to a Step.
  If no Step is specified, a new Step is created.
  Returns the newly created step index.
   */
  async function addTask(taskType, stepIndex = -1) {
    if (!workflow) return;
    const newTaskKey = getNewTaskKey(workflow.tasks);
    const newTask = createTask(taskType);
    let steps = workflow.steps?.slice() || [];
    
    let step
    if (stepIndex < 0) {
      // If no step is specified, we create a new one.
      const newStepKey = getNewStepKey(workflow.steps);
      step = createStep(newStepKey, [newTaskKey]);
      steps.push(step);

    } else {
      // If a step is specified, we'll add the Task to that one.
      step = workflow.steps?.[stepIndex];
      if (step) {
        const [stepKey, stepBody] = step;
        const stepBodyTaskKeys = stepBody?.taskKeys?.slice() || [];
        stepBodyTaskKeys.push(newTaskKey);
        steps[stepIndex] = [ stepKey, { ...stepBody, taskKeys: stepBodyTaskKeys } ];
      }
    }

    if (!newTaskKey || !newTask || !step) {
      console.error('TasksPage: could not create Task');
      return;
    }

    const tasks = {
      ...workflow.tasks,
      [newTaskKey]: newTask
    };

    if (linkStepsInWorkflow) {
      steps = linkStepsInWorkflow(steps, tasks);
    }

    await update({ tasks, steps });
    return (stepIndex < 0) ? steps.length - 1 : stepIndex;
  }

  /*
  Updates (or adds) a Task
   */
  function updateTask(taskKey, task) {
    if (!workflow || !taskKey) return;
    const newTasks = structuredClone(workflow.tasks);  // Copy tasks.
    newTasks[taskKey] = task;
    update({ tasks: newTasks });
  }

  function deleteTask(taskKey) {
    // First check: does the task exist?
    if (!workflow || !taskKey || !workflow?.tasks?.[taskKey]) return;

    // Second check: is this the only task in the step?
    const activeStepTaskKeys = workflow.steps?.[activeStepIndex]?.[1]?.taskKeys || [];
    const onlyTaskInStep = !!(activeStepTaskKeys.length === 1 && activeStepTaskKeys[0] === taskKey);

    // Third check: are you sure?
    const confirmed = onlyTaskInStep
      ? confirm(`Delete Task ${taskKey}? This will also delete the Page.`)
      : confirm(`Delete Task ${taskKey}?`);
    if (!confirmed) return;

    // Delete the task.
    const newTasks = structuredClone(workflow.tasks) || {};  // Copy tasks.
    delete newTasks[taskKey];

    // Delete the task reference in steps.
    const newSteps = structuredClone(workflow.steps) || [];  // Copy steps.
    newSteps.forEach(step => {
      const stepBody = step[1] || {};
      stepBody.taskKeys = (stepBody?.taskKeys || []).filter(key => key !== taskKey);
    });

    // Close the Edit Step Dialog, if necessary. 
    // Note that this will also trigger handleCloseEditStepDialog()
    if (onlyTaskInStep) {
      editStepDialog.current?.closeDialog();
    }

    // Cleanup, then commit.
    const cleanedTasksAndSteps = cleanupTasksAndSteps(newTasks, newSteps);    
    update(cleanedTasksAndSteps);
  }

  function moveStep(from, to) {
    if (!workflow) return;
    const oldSteps = workflow.steps || [];
    if (from < 0 || to < 0 || from >= oldSteps.length || to >= oldSteps.length) return;

    let steps = moveItemInArray(oldSteps, from, to);
    if (linkStepsInWorkflow) {
      steps = linkStepsInWorkflow(steps, workflow.tasks);
    }
    update({ steps });
  }

  function copyStep(stepIndex) {
    if (!workflow) return;
    const { steps, tasks } = workflow;
    const [ stepKey, stepBody ] = steps[stepIndex] || [];

    const confirmed = confirm(`Copy Page ${stepKey}?`);
    if (!confirmed) return;

    const newSteps = steps.slice();  // Copy Steps.
    const newTasks = tasks ? { ...tasks } : {};  // Copy Tasks.

    // Duplicate tasks of the Step we want to copy.
    // Each task needs a new task key.
    const tasksToCopy = stepBody?.taskKeys || [];
    const newTaskKeys = [];
    tasksToCopy.forEach(originalKey => {
      const newTaskKey = getNewTaskKey(newTasks);
      newTaskKeys.push(newTaskKey);
      const newTask = structuredClone(tasks[originalKey]);  // Copy.
      newTasks[newTaskKey] = newTask;
    })

    // Duplicate the Step we want. It needs a new step key.
    const newStepKey = getNewStepKey(newSteps);
    const newStep = [ newStepKey, { ...stepBody, taskKeys: newTaskKeys } ];
    newSteps.push(newStep);

    // cleanedupTasksAndSteps() will also remove tasks not associated with any step.
    const cleanedTasksAndSteps = cleanupTasksAndSteps(newTasks, newSteps); 
    if (linkStepsInWorkflow) {
      cleanedTasksAndSteps.steps = linkStepsInWorkflow(cleanedTasksAndSteps.steps, cleanedTasksAndSteps.tasks);
    }
    update(cleanedTasksAndSteps);
  }

  function deleteStep(stepIndex) {
    if (!workflow) return;
    const { steps, tasks } = workflow;
    const [ stepKey ] = steps[stepIndex] || [];

    const confirmed = confirm(`Delete Page ${stepKey}?`);
    if (!confirmed) return;

    const newSteps = steps.toSpliced(stepIndex, 1);  // Copy then delete Step at stepIndex
    const newTasks = tasks ? { ...tasks } : {};  // Copy tasks

    // cleanedupTasksAndSteps() will also remove tasks not associated with any step.
    const cleanedTasksAndSteps = cleanupTasksAndSteps(newTasks, newSteps); 
    if (linkStepsInWorkflow) {
      cleanedTasksAndSteps.steps = linkStepsInWorkflow(cleanedTasksAndSteps.steps, cleanedTasksAndSteps.tasks);
    }
    update(cleanedTasksAndSteps);
  }

  function openNewTaskDialog(stepIndex = -1) {
    setActiveStepIndex(stepIndex);
    newTaskDialog.current?.openDialog();
  }

  function openEditStepDialog(stepIndex) {
    setActiveStepIndex(stepIndex);
    editStepDialog.current?.openDialog();
  }

  function handleClickAddTaskButton() {
    openNewTaskDialog(-1);
  }

  function handleCloseEditStepDialog() {
    setActiveStepIndex(-1);
  }

  function handleChangeStartingPage(e) {
    const targetStepKey = e?.target?.value || '';
    const targetStepIndex = workflow?.steps?.findIndex(([stepKey]) => stepKey === targetStepKey) || -1;
    if (targetStepIndex < 0) return;
    moveStep(targetStepIndex, 0);
  }

  // Changes the optional "next page" of a step/page
  function updateNextStepForStep(stepKey, next = undefined) {
    if (!workflow || !workflow.steps) return;

    // Check if input is valid
    const stepIndex = workflow.steps.findIndex(step => step[0] === stepKey);
    const stepBody = workflow.steps[stepIndex]?.[1];
    if (!stepBody) return;

    const newSteps = workflow.steps.slice();
    newSteps[stepIndex] = [stepKey, { ...stepBody, next }];

    update({ steps: newSteps });
  }

  // Changes the optional "next page" of a branching answer/choice
  function updateNextStepForTaskAnswer(taskKey, answerIndex, next = undefined) {
    if (!workflow || !workflow?.tasks) return;

    // Check if input is valid
    const task = workflow.tasks[taskKey];
    const answer = task?.answers[answerIndex];
    if (!task || !answer) return;
    
    const newTasks = structuredClone(workflow.tasks);  // Copy tasks.
    const newAnswers = task.answers.with(answerIndex, { ...answer, next })  // Copy, then modify, answers
    newTasks[taskKey] = {  // Insert modified answers into the task inside the copied tasks. Phew!
      ...task,
      answers: newAnswers
    }

    update({ tasks: newTasks });
  }
  
  // Limited Branching Rule:
  // 0. a Step can only have 1 branching task (single answer question task)
  // 1. if a Step has a branching task, it can't have ANOTHER BRANCHING TASK.
  // 2. if a Step already has at least one BRANCHING task, any added question task must be a multiple answer question task.
  // 3. if a Step already has many MULTIPLE ANSWER QUESTION tasks AND NO SINGLE ANSWER QUESTION TASK, ONLY ONE multiple answer question task CAN be transformed into a single answer question task.
  const activeStep = workflow?.steps?.[activeStepIndex]
  const enforceLimitedBranchingRule = {
    stepHasBranch: !!checkCanStepBranch(activeStep, workflow?.tasks),
    stepHasOneTask: activeStep?.[1]?.taskKeys?.length > 0,
    stepHasManyTasks: activeStep?.[1]?.taskKeys?.length > 1
  }

  if (!workflow) return null;

  return (
    <div className="tasks-page">
      <div className="workflow-title flex-row">
        <h2 className="flex-item">{workflow.display_name}</h2>
        {(isActive) ? <span className="status-active">Active</span> : <span className="status-inactive">Inactive</span>}
      </div>
      <section aria-labelledby="workflow-tasks-heading">
        <div className="flex-row">
          <h3 id="workflow-tasks-heading" className="flex-item">Tasks</h3>
          <WorkflowVersion />
        </div>
        <div className="flex-row">
          <button
            className="flex-item big primary decoration-plus"
            onClick={handleClickAddTaskButton}
            type="button"
          >
            Add a new Task
          </button>
          <select
            aria-label="Choose starting Page"
            className="flex-item workflow-starting-page"
            onChange={handleChangeStartingPage}
            style={(workflow?.steps?.length < 1) ? { display: 'none' } : undefined}
            value={firstStepKey}
          >
            <option value="">Choose starting page</option>
            {workflow.steps?.map(([stepKey, stepBody]) => (
              <option
                key={`choose-starting-page-${stepKey}`}
                value={stepKey}
              >
                {firstStepKey === stepKey && 'Starting page: '}
                {stepBody?.taskKeys?.join(', ') || `(${stepKey})` /* Note: if you see the stepKey instead of the taskKeys, something's wrong. */}
              </option>
            ))}
          </select>
        </div>
        {!(workflow.steps?.length > 0) && (
          <div className="no-tasks-notice">
            <WrenchIcon />
            <p>Start by adding tasks to build your Task Funnel here.</p>
          </div>
        )}
        <ul className="steps-list" aria-label="Pages/Steps">
          {workflow.steps?.map((step, index) => (
            <StepItem
              key={`stepItem-${step[0]}`}
              activeDragItem={activeDragItem}
              allSteps={workflow.steps}
              allTasks={workflow.tasks}
              copyStep={copyStep}
              deleteStep={deleteStep}
              moveStep={moveStep}
              isLinearWorkflow={isLinearWorkflow}
              openEditStepDialog={openEditStepDialog}
              setActiveDragItem={setActiveDragItem}
              step={step}
              stepKey={step[0]}
              stepIndex={index}
              updateNextStepForStep={updateNextStepForStep}
              updateNextStepForTaskAnswer={updateNextStepForTaskAnswer}
            />
          ))}
        </ul>
        <NewTaskDialog
          ref={newTaskDialog}
          addTask={addTask}
          enforceLimitedBranchingRule={enforceLimitedBranchingRule}
          openEditStepDialog={openEditStepDialog}
          stepIndex={activeStepIndex}
        />
        <EditStepDialog
          ref={editStepDialog}
          allTasks={workflow.tasks}
          enforceLimitedBranchingRule={enforceLimitedBranchingRule}
          onClose={handleCloseEditStepDialog}
          openNewTaskDialog={openNewTaskDialog}
          step={workflow.steps[activeStepIndex]}
          stepIndex={activeStepIndex}
          deleteTask={deleteTask}
          updateTask={updateTask}
        />

        {/* EXPERIMENTAL */}
        {advancedMode && (
          <ExperimentalPanel
            update={update}
          />
        )}
      </section>
    </div>
  );
}
