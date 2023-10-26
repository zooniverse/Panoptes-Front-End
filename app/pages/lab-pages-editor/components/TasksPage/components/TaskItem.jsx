/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/forbid-prop-types */

import PropTypes from 'prop-types';

// import strings from '../../../strings.json'; // TODO: move all text into strings

function TaskItem({
  task,
  taskKey
}) {
  if (!task || !taskKey) return <li className="task-item">Task ???</li>;

  // TODO: use Panoptes Translations API.
  // e.g. pull from workflow.strings['tasks.T0.instruction']
  // Task.instruction/question isn't particularly standardised across different task types.
  const text = task.instruction || task.question || '';

  return (
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
      </div>
    </li>
  );
}

TaskItem.propTypes = {
  task: PropTypes.object,
  taskKey: PropTypes.string
};

export default TaskItem;
