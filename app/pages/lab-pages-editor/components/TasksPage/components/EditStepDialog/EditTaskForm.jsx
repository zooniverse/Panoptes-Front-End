import PropTypes from 'prop-types';

import DrawingTask from './types/DrawingTask.jsx';
import QuestionTask from './types/QuestionTask.jsx';
import TextTask from './types/TextTask.jsx';
import UnknownTask from './types/UnknownTask.jsx';

const taskTypes = {
  'drawing': DrawingTask,
  'multiple': QuestionTask,  // Shared with single answer question task
  'single': QuestionTask,
  'text': TextTask
};

function EditTaskForm({  // It's not actually a form, but a fieldset that's part of a form.
  deleteTask,
  enforceLimitedBranchingRule,
  stepHasManyTasks,
  task,
  taskKey,
  taskIndexInStep,
  updateTask
}) {
  if (!task || !taskKey) return <li>ERROR: could not render Task</li>;

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
  stepHasManyTasks: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  taskIndexInStep: PropTypes.number,
  updateTask: PropTypes.func
}              

export default EditTaskForm;