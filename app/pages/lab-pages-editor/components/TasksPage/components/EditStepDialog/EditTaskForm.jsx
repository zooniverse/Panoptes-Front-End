import PropTypes from 'prop-types';

import DrawingTask from './types/DrawingTask.jsx';
import QuestionTask from './types/QuestionTask.jsx';
import TextTask from './types/TextTask.jsx';
import UnknownTask from './types/UnknownTask.jsx';
import DeleteIcon from '../../../../icons/DeleteIcon.jsx';

const taskTypes = {
  'drawing': DrawingTask,
  'multiple': QuestionTask,  // Shared with single answer question task
  'single': QuestionTask,
  'text': TextTask
};

function EditTaskForm({  // It's not actually a form, but a fieldset that's part of a form.
  deleteTask,
  enforceLimitedBranchingRule,
  isFirstTaskInStep = true,
  stepHasManyTasks,
  task,
  taskKey,
  updateTask
}) {
  if (!task || !taskKey) return (
    <fieldset
      className="edit-task-form"
    >
      <div className="flex-row">
        <span className="task-key">{taskKey || '???'}</span>
        <p className="flex-item">
          ERROR: could not render Task
          {!task && ' (it doesn\'t exist in workflow.tasks)'}
          {task?.type && ` of type: ${task.type}`}
        </p>
        <button
          aria-label={`Delete Task ${taskKey || '???'}`}
          className="big"
          onClick={() => { deleteTask(taskKey) }}
          type="button"
        >
          <DeleteIcon />
        </button>
      </div>
    </fieldset>
  );

  const TaskForm = taskTypes[task.type] || UnknownTask;
  
  return (
    <fieldset
      className="edit-task-form"
    >
      <legend className="task-key">{taskKey}</legend>
      {(TaskForm)
        ? <TaskForm
            deleteTask={deleteTask}
            enforceLimitedBranchingRule={enforceLimitedBranchingRule}
            isFirstTaskInStep={isFirstTaskInStep}
            stepHasManyTasks={stepHasManyTasks}
            task={task}
            taskKey={taskKey}
            updateTask={updateTask}
          />
        : null
      }
    </fieldset>
  );
}

EditTaskForm.propTypes = {
  deleteTask: PropTypes.func,
  enforceLimitedBranchingRule: PropTypes.shape({
    stepHasBranch: PropTypes.bool
  }),
  isFirstTaskInStep: PropTypes.bool,
  stepHasManyTasks: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
}              

export default EditTaskForm;