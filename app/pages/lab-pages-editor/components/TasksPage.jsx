/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */
/* eslint-disable react/jsx-boolean-value */

import { useWorkflowContext } from '../context.js';
// import strings from '../strings.json'; // TODO: move all text into strings

import GripIcon from '../icons/GripIcon.jsx';

export default function TasksPage() {
  const { workflow } = useWorkflowContext();
  const isActive = true; // TODO

  function placeholderEventHandler() {
    console.log('+++ TODO');
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
      <section aria-labelledby="workflow-tasks-heading">
        <h3 id="workflow-tasks-heading">Tasks</h3>
        <div className="flex-row">
          <button
            className="flex-item big primary"
            onClick={placeholderEventHandler}
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
          {Object.entries(workflow.tasks).map(([taskKey, task]) => (
            <StepItem
              task={task}
              taskKey={taskKey}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

// WARNING/TODO: this should be handling steps, not tasks
function StepItem({ task, taskKey }) {
  const stepKey = 'TODO';
  if (!task || !taskKey) return null;

  // TODO: use Panoptes Translations API.
  // e.g. pull from workflow.strings['tasks.T0.instruction']
  // Task.instruction/question isn't particularly standardised across different task types.
  const text = task.instruction || task.question || '';

  return (
    <li className="step-item">
      <div className="grab-handle flex-row spacing-bottom-XS">
        <button aria-label={`Rearrange Page ${stepKey} upwards`} className="plain" type="button">
          <span className="fa fa-caret-up" role="img" />
        </button>
        {/* TODO: add drag/drop functionality. Perhaps this needs to be wider, too. */}
        <GripIcon color="#A6A7A9" />
        <button aria-label={`Rearrange Page/Step ${stepKey} downwards`} className="plain" type="button">
          <span className="fa fa-caret-down" role="img" />
        </button>
      </div>
      <ul className="tasks-list" aria-label={`Tasks for Page/Step ${stepKey}`}>
        <li className="task-item">
          <div className="flex-row spacing-bottom-M">
            <span className="task-key">{taskKey}</span>
            <span className="task-icon">
              {/* TODO: change icon and aria label depending on task type */}
              <span
                aria-label="Task type: text"
                className="fa fa fa-file-text-o fa-fw"
                role="img"
              />
            </span>
            <span className="task-text flex-item">{text}</span>
            <button aria-label={`Delete Page/Step ${stepKey}`} className="plain" type="button">
              <span className="fa fa-trash" role="img" />
            </button>
            <button aria-label={`Copy Page/Step ${stepKey}`} className="plain" type="button">
              <span className="fa fa-copy" role="img" />
            </button>
            <button aria-label={`Edit Page/Step ${stepKey}`} className="plain" type="button">
              <span className="fa fa-pencil" role="img" />
            </button>
          </div>
          <div className="flex-row">
            <input className="flex-item" type="text" value="Enter answer here" />
          </div>
        </li>
      </ul>
    </li>
  );
}
