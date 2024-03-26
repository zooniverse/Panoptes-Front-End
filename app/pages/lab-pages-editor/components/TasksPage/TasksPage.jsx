import { useRef, useState } from 'react'
import { useWorkflowContext } from '../../context.js';
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

  // Adds a new Task (with default settings).
  // If no Step is specified, a new Step is created.
  // Returns the newly created step index.
  async function addTask(taskType, stepKey) {
    const newTaskKey = getNewTaskKey(workflow?.tasks);
    const newTask = createTask(taskType);
    const steps = workflow?.steps?.slice() || [];
    
    // If a stepKey is defined, add the new Task to that Step.
    // If not, create a new Step, and then add the new Task to that Step.
    let step, stepIndex
    if (stepKey) {
      stepIndex = workflow?.steps?.findIndex(s => s[0] === stepKey);
      step = workflow?.steps?.[stepIndex];

      if (step) {
        const stepBody = step[1] || {}
        const stepBodyTaskKeys = (stepBody.taskKeys || []).push(newTaskKey);
        steps[stepIndex] = [ stepKey, { ...stepBody, taskKeys: stepBodyTaskKeys } ];
      }

    } else {
      const newStepKey = getNewStepKey(workflow?.steps);
      step = createStep(newStepKey, [newTaskKey]);
      steps.push(step);
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
    return steps.length - 1;
  }

  function updateTask(taskKey, task) {
    if (!taskKey) return;
    const tasks = JSON.parse(JSON.stringify(workflow?.tasks || {}));
    tasks[taskKey] = task
    update({tasks});
  }

  function deleteTask(taskKey) {
    if (!taskKey) return;
    // TODO
  }

  function moveStep(from, to) {
    const oldSteps = workflow?.steps || [];
    if (from < 0 || to < 0 || from >= oldSteps.length || to >= oldSteps.length) return;

    const steps = moveItemInArray(oldSteps, from, to);
    update({ steps });
  }

  function deleteStep(stepIndex) {
    if (!workflow) return;
    const { steps, tasks } = workflow;
    const [ stepKey, stepBody ] = steps[stepIndex] || [];
    const tasksToBeDeleted = stepBody?.taskKeys || [];

    const confirmed = confirm(`Delete Page ${stepKey}?`);
    if (!confirmed) return;

    const newSteps = steps.toSpliced(stepIndex, 1);  // Copy then delete Step at stepIndex
    const newTasks = tasks ? { ...tasks } : {};  // Copy tasks
    tasksToBeDeleted.forEach(taskKey => delete newTasks[taskKey]);

    const cleanedTasksAndSteps = cleanupTasksAndSteps(newTasks, newSteps); 
    update(cleanedTasksAndSteps);
  }

  function openNewTaskDialog(stepIndex = -1) {
    setActiveStepIndex(stepIndex);
    newTaskDialog.current?.openDialog();
  }

  function openNewTaskDialogForNewStep() {
    openNewTaskDialog(-1);
  }

  function openEditStepDialog(stepIndex) {
    setActiveStepIndex(stepIndex);
    editStepDialog.current?.openDialog();
  }

  function handleCloseEditStepDialog() {
    setActiveStepIndex(-1);
  }

  // Changes the optional "next page" of a step/page
  function updateNextStepForStep(stepKey, next = undefined) {
    // Check if input is valid
    const stepIndex = workflow?.steps?.findIndex(step => step[0] === stepKey);
    const stepBody = workflow?.steps?.[stepIndex]?.[1];
    if (!stepBody) return;

    const newSteps = workflow.steps.slice();
    newSteps[stepIndex] = [stepKey, { ...stepBody, next }];

    update({ steps: newSteps });
  }

  // Changes the optional "next page" of a branching answer/choice
  function updateNextStepForTaskAnswer(taskKey, answerIndex, next = undefined) {
    // Check if input is valid
    const task = workflow?.tasks?.[taskKey];
    const answer = task?.answers[answerIndex];
    if (!task || !answer) return;
    
    const newTasks = workflow.tasks ? { ...workflow.tasks } : {};  // Copy tasks
    const newAnswers = task.answers.with(answerIndex, { ...answer, next })  // Copy, then modify, answers
    newTasks[taskKey] = {  // Insert modified answers into the task inside the copied tasks. Phew!
      ...task,
      answers: newAnswers
    }

    update({ tasks: newTasks });
  }

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
            onClick={openNewTaskDialogForNewStep}
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
          <span>[DEBUG] activeStepIndex({activeStepIndex})</span>
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
          openEditStepDialog={openEditStepDialog}
        />
        <EditStepDialog
          ref={editStepDialog}
          allTasks={workflow.tasks}
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
