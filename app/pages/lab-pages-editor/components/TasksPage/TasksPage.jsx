/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */
/* eslint-disable react/jsx-boolean-value */

import { useWorkflowContext } from '../../context.js';
import getNewTaskKey from '../../helpers/getNewTaskKey.js';
import getNewStepKey from '../../helpers/getNewStepKey.js';
import createTask from '../../helpers/createTask.js';
import createStep from '../../helpers/createStep.js';
// import strings from '../../strings.json'; // TODO: move all text into strings

import StepItem from './components/StepItem.jsx';

export default function TasksPage() {
  const { workflow, update } = useWorkflowContext();
  const isActive = true; // TODO

  // Automatically adds one pre-built Text Task
  function experimentalAddNewTaskWithStep() {
    const newTaskKey = getNewTaskKey(workflow?.tasks);
    const newStepKey = getNewStepKey(workflow?.steps);
    const newTask = createTask('text');
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

    update({ tasks, steps });
  }

  function experimentalReset() {
    update({
      tasks: {},
      steps: []
    });
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
          <button
            className="flex-item big primary"
            onClick={experimentalAddNewTaskWithStep}
            type="button"
          >
            Add a new Task +
          </button>
          {/* Dev observation: the <select> should have some label to indicate it's for choosing the starting task. */}
          <select
            aria-label="Choose starting page"
            className="flex-item"
          >
            <option disabled>Choose starting Page</option>
          </select>
        </div>
        <ul className="steps-list" aria-label="Pages/Steps">
          {/* WARNING: this should be workflow.steps */}
          {workflow.steps.map(([stepKey, step]) => (
            <StepItem
              allTasks={workflow.tasks}
              step={step}
              stepKey={stepKey}
            />
          ))}
        </ul>
        <button
          className="big primary"
          onClick={experimentalReset}
          type="button"
        >
          RESET
        </button>
      </section>
    </div>
  );
}
