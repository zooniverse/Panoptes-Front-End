import { useRef, useState } from 'react'
import { useWorkflowContext } from '../../context.js';
import createStep from '../../helpers/createStep.js';
import createTask from '../../helpers/createTask.js';
import getNewStepKey from '../../helpers/getNewStepKey.js';
import getNewTaskKey from '../../helpers/getNewTaskKey.js';
import linkStepsInWorkflow from '../../helpers/linkStepsInWorkflow.js';
import moveItemInArray from '../../helpers/moveItemInArray.js';
// import strings from '../../strings.json'; // TODO: move all text into strings

import EditStepDialog from './components/EditStepDialog';
import NewTaskDialog from './components/NewTaskDialog.jsx';
import StepItem from './components/StepItem';
import ExternalLinkIcon from '../../icons/ExternalLinkIcon.jsx';

export default function TasksPage() {
  const { workflow, update } = useWorkflowContext();
  const editStepDialog = useRef(null);
  const newTaskDialog = useRef(null);
  const [ activeStepIndex, setActiveStepIndex ] = useState(-1);  // Tracks which Step is being edited.
  const [ activeDragItem, setActiveDragItem ] = useState(-1);  // Keeps track of active item being dragged (StepItem). This is because "dragOver" CAN'T read the data from dragEnter.dataTransfer.getData().
  const isActive = true; // TODO

  // Adds a new Task (with default settings), inside a new Step. Returns the newly created step index.
  async function addNewTaskWithStep(taskType) {
    const newTaskKey = getNewTaskKey(workflow?.tasks);
    const newStepKey = getNewStepKey(workflow?.steps);
    const newTask = createTask(taskType);
    const newStep = createStep(newStepKey, [newTaskKey]);

    if (!newTaskKey || !newStepKey || !newTask || !newStep) {
      console.error('TasksPage: could not create Task');
      return;
    }

    const tasks = {
      ...workflow.tasks,
      [newTaskKey]: newTask
    };
    const steps = linkStepsInWorkflow([...workflow.steps, newStep]);

    await update({ tasks, steps });
    return steps.length - 1;
  }

  function experimentalReset() {
    update({
      tasks: {},
      steps: []
    });
  }

  function experimentalLinkSteps() {
    const newSteps = linkStepsInWorkflow(workflow?.steps, workflow?.tasks);
    update({ steps: newSteps });
  }

  function moveStep(from, to) {
    const oldSteps = workflow?.steps || [];
    if (from < 0 || to < 0 || from >= oldSteps.length || to >= oldSteps.length) return;

    const steps = linkStepsInWorkflow(moveItemInArray(oldSteps, from, to));
    update({ steps });
  }

  function deleteStep(stepIndex) {
    if (!workflow) return;
    const { steps, tasks } = workflow;
    const [ stepKey, stepBody ] = steps[stepIndex] || [];
    const tasksToBeDeleted = stepBody?.taskKeys || [];

    // const confirmed = confirm(`Delete Page ${stepKey}?`);
    // if (!confirmed) return;

    // TODO
    console.log('+++ deleteStep: ', stepKey, stepBody, tasksToBeDeleted);

    const newSteps = steps.toSpliced(stepIndex, 1);  // Copy then delete Step at stepIndex
    const newTasks = tasks ? { ...tasks } : {};  // Copy tasks
    tasksToBeDeleted.forEach(taskKey => delete newTasks[taskKey]);

    console.log('+++ newSteps: ', steps, '\n ===> \n', newSteps);
    console.log('+++ newTasks: ', tasks, '\n ===> \n', newTasks);

    cleanupTasksAndSteps(newTasks, newSteps);
  }

  /*
  Clean up tasks and steps.
  - Remove orphaned references in branching tasks.
  - Remove steps without tasks.
  - Remove tasks not associated with any step.
   */
  function cleanupTasksAndSteps(tasks = {}, steps = []) {
    const newTasks = { ...tasks };  // Copy tasks
    const newSteps = steps.slice();  // Copy steps

    const taskKeys = Object.keys(newTasks);
    const stepKeys = newSteps.map(step => step[0]);

    console.log('+++ cleanupTasksAndSteps: ', taskKeys, stepKeys);

    // WARNING: modifying task object.
    // TODO: create a deep copy before modifying?
    Object.values(tasks).forEach(taskBody => {
      taskBody?.answers?.forEach(answer => {
        if (answer.next && !taskKeys.includes(answer.next) && !stepKeys.includes(answer.next)) {
          console.log('+++ answer: ', answer);
        }
      })
    });

    return { tasks: newTasks, steps: newSteps };
  }

  // aka openEditStepDialog
  function editStep(stepIndex) {
    setActiveStepIndex(stepIndex);
    editStepDialog.current?.openDialog();
  }

  function openNewTaskDialog() {
    newTaskDialog.current?.openDialog();
  }

  function deleteTask(taskKey) {
    if (!taskKey) return;

    // TODO
    console.log('+++ deleteTask: ', taskKey);
  }

  function updateTask(taskKey, task) {
    if (!taskKey) return;
    const tasks = JSON.parse(JSON.stringify(workflow?.tasks || {}));
    tasks[taskKey] = task
    update({tasks});
  }

  // Changes the optional "next page" of a branching answer/choice
  function updateAnswerNext(taskKey, answerIndex, next = undefined) {
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

  const previewUrl = 'https://frontend.preview.zooniverse.org/projects/darkeshard/example-1982/classify/workflow/3711?env=staging';
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
            onClick={openNewTaskDialog}
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
              editStep={editStep}
              moveStep={moveStep}
              setActiveDragItem={setActiveDragItem}
              step={step}
              stepKey={step[0]}
              stepIndex={index}
              updateAnswerNext={updateAnswerNext}
            />
          ))}
        </ul>
        <NewTaskDialog
          ref={newTaskDialog}
          addTaskWithStep={addNewTaskWithStep}
          editStep={editStep}
        />
        <EditStepDialog
          ref={editStepDialog}
          allTasks={workflow.tasks}
          step={workflow.steps[activeStepIndex]}
          stepIndex={activeStepIndex}
          deleteTask={deleteTask}
          updateTask={updateTask}
        />

        {/* EXPERIMENTAL */}
        <div
          style={{
            padding: '16px',
            margin: '8px 0',
            border: '2px dashed #c04040'
          }}
        >
          <button
            className="big"
            onClick={experimentalReset}
            type="button"
            style={{ margin: '0 4px' }}
          >
            RESET
          </button>
          <button
            className="big"
            onClick={experimentalLinkSteps}
            type="button"
            style={{ margin: '0 4px' }}
          >
            LINK
          </button>
          <button
            className="big"
            onClick={editStep}
            type="button"
            style={{ margin: '0 4px' }}
          >
            EDIT STEP
          </button>
        </div>
      </section>
    </div>
  );
}
