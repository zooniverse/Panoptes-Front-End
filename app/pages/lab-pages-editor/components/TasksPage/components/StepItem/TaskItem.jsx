import PropTypes from 'prop-types';

// import strings from '../../../strings.json'; // TODO: move all text into strings
import DrawingToolIcon from '../../../../icons/DrawingToolIcon.jsx';
import TaskIcon from '../../../../icons/TaskIcon.jsx';
import BranchingNextControls from './BranchingNextControls.jsx';

const TaskLabels = {
  'drawing': 'Drawing Task',
  'multiple': 'Question Task',  // Multiple question
  'single': 'Question Task',  // Single question
  'text': 'Text Task'
};

const DEFAULT_HANDLER = () => {};

function TaskItem({
  allSteps = [],
  isBranchingTask = false,
  stepKey,
  task,
  taskKey,
  updateNextStepForTaskAnswer = DEFAULT_HANDLER
}) {
  if (!task || !taskKey) return (
    <li className="task-item">
      <div className="flex-row">
        <span className="task-key">{taskKey || '???'}</span>
        <p>
          ERROR: could not render Task
          {!task && ' (it doesn\'t exist in workflow.tasks)'}
          {task?.type && ` of type: ${task.type}`}
        </p>
      </div>
    </li>
  );

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
            alt={TaskLabels[task.type] || 'Unknown Task Type'}
            type={task.type}
          />
        </span>
        <span className="task-text flex-item">{taskText}</span>
      </div>
      {isBranchingTask && (
        <BranchingNextControls
          allSteps={allSteps}
          stepKey={stepKey}
          task={task}
          taskKey={taskKey}
          updateNextStepForTaskAnswer={updateNextStepForTaskAnswer}
        />
      )}
      {!isBranchingTask && (
        <PlaceholderAnswers task={task} taskKey={taskKey} />
      )}
    </li>
  );
}

TaskItem.propTypes = {
  allSteps: PropTypes.arrayOf(PropTypes.array),
  isBranchingTask: PropTypes.bool,
  stepKey: PropTypes.string,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateNextStepForTaskAnswer: PropTypes.func
};

export default TaskItem;

function PlaceholderAnswers({
  task,
  taskKey
}) {
  if (!task || !taskKey) return null;

  if (task.type === 'single' || task.type === 'multiple') {
    const answers = task.answers || [];

    return (
      <ul className="horizontal-list">
        {answers.map((answer, index) => (
          <li key={`placeholder-answer-${taskKey}-${index}`}>
            <div className="fake-button">{answer.label}</div>
          </li>
        ))}
      </ul>
    );
  }

  if (task.type === 'text') {
    return (
      <div>
        <div className="fake-text-input">Contributor text here</div>
      </div>
    );
  }

  if (task.type === 'drawing') {
    const tools = task.tools || [];

    return (
      <ul className="fake-drawing-tools">
        {tools.map((tool, index) => (
          <li
            key={`placeholder-answer-${taskKey}-${index}`}
          >
            <span className="icon-wrapper">
              <DrawingToolIcon type={tool?.type} color={tool?.color} />
            </span>
            <span>{tool?.label}</span>
            <span>0 drawn</span>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}
