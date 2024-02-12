import PropTypes from 'prop-types';

// import strings from '../../../strings.json'; // TODO: move all text into strings
import TaskIcon from '../../../../icons/TaskIcon.jsx';

const TaskLabels = {
  'drawing': 'Drawing Task',
  'single': 'Question Task',  // Single question
  'text': 'Text Task'
};

function TaskItem({
  task,
  taskKey
}) {
  if (!task || !taskKey) return <li className="task-item">ERROR: could not render Task</li>;

  // TODO: use Panoptes Translations API.
  // e.g. pull from workflow.strings['tasks.T0.instruction']
  // Task.instruction/question isn't particularly standardised across different task types.
  const taskText = task.instruction || task.question || '';

  return (
    <li className="task-item">
      <div className="flex-row spacing-bottom-M">
        <span className="task-key">{taskKey}</span>
        <span className="task-icon">
          <TaskIcon
            alt={TaskLabels[task.type]}
            type={task.type}
          />
        </span>
        <span className="task-text flex-item">{taskText}</span>
      </div>
    </li>
  );
}

TaskItem.propTypes = {
  task: PropTypes.object,
  taskKey: PropTypes.string
};

export default TaskItem;
