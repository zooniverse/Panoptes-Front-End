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
    const steps = [...workflow.steps, newStep];

    await update({ tasks, steps });
    return steps.length - 1;
  }

  function experimentalReset() {
    update({
      tasks: {},
      steps: []
    });
  }

  function experimentalQuickSetup() {
    update({
      tasks: {
        'T0': {
          answers: [
            {next: 'P1', label: 'Animals'},
            {next: 'P2', label: 'Fruits'},
            {label: 'Neither'}
          ],
          help: '',
          question: 'Do you like Animals or Fruits?',
          required: false,
          type: 'single'
        },
        'T1': { help: '', type: 'text', required: false, instruction: 'Which animal?' },
        'T2': { help: '', type: 'text', required: false, instruction: 'Which fruit?' }
      },
      steps: [
        ['P0', { stepKey: 'P0', taskKeys: ["T0"] }],
        ['P1', { next: 'P2', stepKey: 'P1', taskKeys: ["T1"] }],
        ['P2', { stepKey: 'P2', taskKeys: ["T2"] }]
      ]
    });
  }

  function experimentalQuickSetupBranching() {
    update({
      tasks: {
        'T1.1': {
          answers: [
            {next: 'P2', label: 'Go to the 🔴 RED page'},
            {next: 'P3', label: 'Go to the 🔵 BLUE page'},
          ],
          help: '',
          question: 'Oh dear, this page has multiple branching tasks. Let\'s see what happens',
          required: false,
          type: 'single'
        },
        'T1.2': {
          answers: [
            {next: 'P4', label: 'Go to the 🟡 YELLOW page'},
            {next: 'P5', label: 'Go to the 🟢 GREEN page'},
          ],
          help: '',
          question: 'This is the second branching task. If you answer both on the page, where do you branch to?',
          required: false,
          type: 'single'
        },
        'T2': { help: '', type: 'text', required: false, instruction: 'Welcome to the 🔴 RED page! How do you feel?' },
        'T3': { help: '', type: 'text', required: false, instruction: 'Welcome to the 🔵 BLUE page! How do you feel?' },
        'T4': { help: '', type: 'text', required: false, instruction: 'Welcome to the 🟡 YELLOW page! How do you feel?' },
        'T5': { help: '', type: 'text', required: false, instruction: 'Welcome to the 🟢 GREEN page! How do you feel?' },
      },
      steps: [
        ['P1', { stepKey: 'P1', taskKeys: ['T1.1', 'T1.2'] }],
        ['P2', { stepKey: 'P2', taskKeys: ['T2'] }],
        ['P3', { stepKey: 'P3', taskKeys: ['T3'] }],
        ['P4', { stepKey: 'P4', taskKeys: ['T4'] }],
        ['P5', { stepKey: 'P5', taskKeys: ['T5'] }],
      ]
    });
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
  }

  function updateTask(taskKey, task) {
    if (!taskKey) return;
    const tasks = JSON.parse(JSON.stringify(workflow?.tasks || {}));
    tasks[taskKey] = task
    update({tasks});
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
              updateNextStepForStep={updateNextStepForStep}
              updateNextStepForTaskAnswer={updateNextStepForTaskAnswer}
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
            onClick={experimentalQuickSetup}
            type="button"
            style={{ margin: '0 4px' }}
          >
            QUICK SETUP (simple)
          </button>
          <button
            className="big"
            onClick={experimentalQuickSetupBranching}
            type="button"
            style={{ margin: '0 4px' }}
          >
            QUICK SETUP (advanced, branching)
          </button>
        </div>
      </section>
    </div>
  );
}
