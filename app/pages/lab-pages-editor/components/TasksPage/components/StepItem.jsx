/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/forbid-prop-types */

import PropTypes from 'prop-types';

// import strings from '../../../strings.json'; // TODO: move all text into strings
import TaskItem from './TaskItem.jsx';
import GripIcon from '../../../icons/GripIcon.jsx';

function StepItem({
  allTasks,
  step,
  stepKey
}) {
  if (!step || !stepKey || !allTasks) return <li className="step-item">ERROR: could not render Step</li>;

  const taskKeys = step.taskKeys || [];

  return (
    <li className="step-item">
      <div className="step-controls flex-row spacing-bottom-XS">
        <span className="step-controls-left" />
        <div className="step-controls-center">
          <button aria-label={`Rearrange Page ${stepKey} upwards`} className="plain" type="button">
            <span className="fa fa-caret-up" />
          </button>
          {/* TODO: add drag/drop functionality. Perhaps this needs to be wider, too. */}
          <GripIcon className="grab-handle" color="#A6A7A9" />
          <button aria-label={`Rearrange Page/Step ${stepKey} downwards`} className="plain" type="button">
            <span className="fa fa-caret-down" />
          </button>
        </div>
        <div className="step-controls-right">
          <button aria-label={`Delete Page/Step ${stepKey}`} className="plain" type="button">
            <span className="fa fa-trash" />
          </button>
          <button aria-label={`Copy Page/Step ${stepKey}`} className="plain" type="button">
            <span className="fa fa-copy" />
          </button>
          <button aria-label={`Edit Page/Step ${stepKey}`} className="plain" type="button">
            <span className="fa fa-pencil" />
          </button>
        </div>
      </div>
      <ul className="tasks-list" aria-label={`Tasks for Page/Step ${stepKey}`}>
        {taskKeys.map((taskKey) => {
          const task = allTasks[taskKey];
          return (
            <TaskItem task={task} taskKey={taskKey} />
          );
        })}
      </ul>
    </li>
  );
}

StepItem.propTypes = {
  allTasks: PropTypes.object,
  step: PropTypes.object,
  stepKey: PropTypes.string
};

export default StepItem;
