import { useRef, useState } from 'react'
import { useWorkflowContext } from '../../context.js';
import canStepBranch from '../../helpers/canStepBranch.js';
import createStep from '../../helpers/createStep.js';
import createTask from '../../helpers/createTask.js';
import getNewStepKey from '../../helpers/getNewStepKey.js';
import getNewTaskKey from '../../helpers/getNewTaskKey.js';
import moveItemInArray from '../../helpers/moveItemInArray.js';
import cleanupTasksAndSteps from '../../helpers/cleanupTasksAndSteps.js';
import getPreviewEnv from '../../helpers/getPreviewEnv.js';
// import strings from '../../strings.json'; // TODO: move all text into strings

import ExperimentalPanel from './ExperimentalPanel.jsx';
import EditStepDialog from './components/EditStepDialog';
import NewTaskDialog from './components/NewTaskDialog.jsx';
import StepItem from './components/StepItem';
import ExternalLinkIcon from '../../icons/ExternalLinkIcon.jsx';

export default function TasksPage() {
  const { project, workflow, update } = useWorkflowContext();
  const editStepDialog = useRef(null);
  const newTaskDialog = useRef(null);
  const [ activeStepIndex, setActiveStepIndex ] = useState(-1);  // Tracks which Step is being edited.
  const [ activeDragItem, setActiveDragItem ] = useState(-1);  // Keeps track of active item being dragged (StepItem). This is because "dragOver" CAN'T read the data from dragEnter.dataTransfer.getData().
  const isActive = true; // TODO

  /*
  Adds a new Task of a specified type (with default settings) to a Step.
  If no Step is specified, a new Step is created.
  Returns the newly created step index.
   */
  async function addTask(taskType, stepIndex = -1) {
    if (!workflow) return;
    const newTaskKey = getNewTaskKey(workflow.tasks);
    const newTask = createTask(taskType);
    const steps = workflow.steps?.slice() || [];
    
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

    await update({ tasks, steps });
    return (stepIndex < 0) ? steps.length - 1 : stepIndex;
  }

  /*
  Updates (or adds) a Task
   */
  function updateTask(taskKey, task) {
    if (!workflow || !taskKey) return;
    const newTasks = structuredClone(workflow.tasks);  // Copy tasks
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
    const newTasks = structuredClone(workflow.tasks) || {};
    delete newTasks[taskKey];

    // Delete the task reference in steps.
    const newSteps = structuredClone(workflow.steps) || [];
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

    const steps = moveItemInArray(oldSteps, from, to);
    update({ steps });
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
    
    const newTasks = structuredClone(workflow.tasks);  // Copy tasks
    const newAnswers = task.answers.with(answerIndex, { ...answer, next })  // Copy, then modify, answers
    newTasks[taskKey] = {  // Insert modified answers into the task inside the copied tasks. Phew!
      ...task,
      answers: newAnswers
    }

    update({ tasks: newTasks });
  }
  
  // Limited Branching Rule:
  // 0. a Step can only have 1 branching task (single answer question task)
  // 1. if a Step has a branching task, it can't have any other tasks.
  // 2. if a Step already has tasks, any added question task must be a multiple answer question task.
  const activeStep = workflow?.steps?.[activeStepIndex]
  const enforceLimitedBranchingRule1 = !!canStepBranch(activeStep, workflow?.tasks)
  const enforceLimitedBranchingRule2 = activeStep?.[1]?.taskKeys?.length > 0

  const previewEnv = getPreviewEnv();
  const previewUrl = `https://frontend.preview.zooniverse.org/projects/${project?.slug}/classify/workflow/${workflow?.id}${previewEnv}`;
  if (!workflow) return null;

  return (
    <div className="tasks-page">
      <div className="workflow-title flex-row">
        <h2 className="flex-item">{workflow?.display_name}</h2>
        <span className="workflow-id">{`#${workflow?.id}`}</span>
        {(isActive) ? <span className="status-active">Active</span> : <span className="status-inactive">Inactive</span>}
      </div>
      <section aria-labelledby="workflow-tasks-heading">
        <h3 id="workflow-tasks-heading">Tasks</h3>
        <div className="flex-row">
          <button
            className="flex-item big primary decoration-plus"
            onClick={handleClickAddTaskButton}
            type="button"
          >
            Add a new Task
          </button>
          <a
            className="flex-item button-link"
            href={previewUrl}
            rel="noopener noreferrer"
            target='_blank'
          >
            Preview Workflow <ExternalLinkIcon />
          </a>
        </div>
        <ul className="steps-list" aria-label="Pages/Steps">
          {workflow.steps.map((step, index) => (
            <StepItem
              key={`stepItem-${step[0]}`}
              activeDragItem={activeDragItem}
              allSteps={workflow.steps}
              allTasks={workflow.tasks}
              deleteStep={deleteStep}
              moveStep={moveStep}
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
          enforceLimitedBranchingRule={enforceLimitedBranchingRule2}
          openEditStepDialog={openEditStepDialog}
          stepIndex={activeStepIndex}
        />
        <EditStepDialog
          ref={editStepDialog}
          allTasks={workflow.tasks}
          enforceLimitedBranchingRule={enforceLimitedBranchingRule1}
          onClose={handleCloseEditStepDialog}
          openNewTaskDialog={openNewTaskDialog}
          step={workflow.steps[activeStepIndex]}
          stepIndex={activeStepIndex}
          deleteTask={deleteTask}
          updateTask={updateTask}
        />

        {/* EXPERIMENTAL */}
        <ExperimentalPanel
          update={update}
        />
      </section>
    </div>
  );
}
