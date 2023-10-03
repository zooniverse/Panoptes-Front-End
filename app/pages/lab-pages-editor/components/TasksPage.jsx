/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */

import { useWorkflowContext } from '../context.js';
import strings from '../strings.json'; // TODO: move all text into strings

export default function TasksPage() {
  const { workflow, update } = useWorkflowContext();
  const isActive = true; // TODO

  if (!workflow) return null;

  return (
    <div className="tasks-page">
      <div className="workflow-title flex-row">
        <h2 className="flex-item">{workflow?.display_name}</h2>
        <span className="workflow-id">{`#${workflow?.id}`}</span>
        {(isActive) ? <span className="status-active">Active</span> : <span className="status-inactive">Inactive</span>}
      </div>
      {/* TODO: the Tasks thing might need to be a section? */}
      <div>
        <div>Tasks</div>
        <div className="flex-row">
          <button className="flex-item" type="button">Add a new Task +</button>
          <select className="flex-item">
            <option>T0</option>
            <option>T1</option>
          </select>
        </div>
      </div>
    </div>
  );
}
