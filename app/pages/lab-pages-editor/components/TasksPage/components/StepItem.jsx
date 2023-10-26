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
  if (!step || !stepKey || !allTasks) return <li className="step-item">Step ???</li>;

  console.log('+++ ', stepKey, step, allTasks);

  return (
    <li className="step-item">
      <div className="grab-handle flex-row spacing-bottom-XS">
        <button aria-label={`Rearrange Page ${stepKey} upwards`} className="plain" type="button">
          <span className="fa fa-caret-up" />
        </button>
        {/* TODO: add drag/drop functionality. Perhaps this needs to be wider, too. */}
        <GripIcon color="#A6A7A9" />
        <button aria-label={`Rearrange Page/Step ${stepKey} downwards`} className="plain" type="button">
          <span className="fa fa-caret-down" />
        </button>
      </div>
      <ul className="tasks-list" aria-label={`Tasks for Page/Step ${stepKey}`}>
        {Object.entries(allTasks).map(([taskKey, task]) => (
          <TaskItem task={task} taskKey={taskKey} />
        ))}
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
