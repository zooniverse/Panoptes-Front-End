/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */
/* eslint-disable react/jsx-boolean-value */

import { useRef, useState } from 'react'
import { useWorkflowContext } from '../../context.js';
import createStep from '../../helpers/createStep.js';
import createTask from '../../helpers/createTask.js';
import getNewStepKey from '../../helpers/getNewStepKey.js';
import getNewTaskKey from '../../helpers/getNewTaskKey.js';
import linkStepsInWorkflow from '../../helpers/linkStepsInWorkflow.js';
import moveItemInArray from '../../helpers/moveItemInArray.js';
// import strings from '../../strings.json'; // TODO: move all text into strings

import EditStepDialog from './components/EditStepDialog.jsx';
import NewTaskButtonAndDialog from './components/NewTaskButtonAndDialog.jsx';
import StepItem from './components/StepItem.jsx';

export default function TasksPage() {
  const { workflow, update } = useWorkflowContext();
  const editStepDialog = useRef(null);
  const [ activeDragItem, setActiveDragItem ] = useState(-1);  // Keeps track of active item being dragged (StepItem). This is because "dragOver" CAN'T read the data from dragEnter.dataTransfer.getData().
  const isActive = true; // TODO

  function experimentalAddNewTaskWithStep(taskType) {
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

    update({ tasks, steps });
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

  function editStep() {
    editStepDialog.current?.openDialog();
  }

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
          <NewTaskButtonAndDialog
            addTaskWithStep={experimentalAddNewTaskWithStep}
          />
          {/* Dev observation: the <select> should have some label to indicate it's for choosing the starting task. */}
          <select
            aria-label="Choose starting page"
            className="flex-item"
          >
            <option disabled>Choose starting Page</option>
          </select>
        </div>
        <ul className="steps-list" aria-label="Pages/Steps">
          {workflow.steps.map(([stepKey, step], index) => (
            <StepItem
              key={`stepItem-${stepKey}`}
              activeDragItem={activeDragItem}
              allTasks={workflow.tasks}
              moveStep={moveStep}
              setActiveDragItem={setActiveDragItem}
              step={step}
              stepKey={stepKey}
              stepIndex={index}
            />
          ))}
        </ul>
        <EditStepDialog
          ref={editStepDialog}
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
