/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */

import { useWorkflowContext } from '../context.js';
import strings from '../strings.json'; // TODO: move all text into strings

export default function TasksPage() {
  const { workflow, update } = useWorkflowContext();
  const isActive = true; // TODO

  function addNewTask() {
    if (!workflow || !update) return;
  }

  console.log('+++ workflow: ', workflow);

  if (!workflow) return null;

  return (
    <div className="tasks-page">
      <div className="workflow-title flex-row">
        <h2 className="flex-item">{workflow?.display_name}</h2>
        <span className="workflow-id">{`#${workflow?.id}`}</span>
        {(isActive) ? <span className="status-active">Active</span> : <span className="status-inactive">Inactive</span>}
      </div>
      {/* TODO: the Tasks thing might need to be a section? Also some things need better semantic tags */}
      <div>
        <div className="big-text">Tasks</div>
        <div className="flex-row">
          <button
            className="flex-item big primary"
            type="button"
          >
            Add a new Task +
          </button>
          {/* Dev observation: the <select> should have some label to indicate it's for choosing the starting task. */}
          <select
            aria-label="Choose starting test"
            className="flex-item"
          >
            <option disabled={true}>Choose starting test</option>
          </select>
        </div>
        <div>
          {Object.entries(workflow.tasks).map(([key, val]) => (
            <TaskItem
              task={val}
              taskId={key}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task, taskId }) {
  if (!task || !taskId) return null;

  const text = task.question;

  return (
    <div className="task-item">
      {taskId}
      {text}
    </div>
  )
}