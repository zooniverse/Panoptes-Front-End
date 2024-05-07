import PropTypes from 'prop-types';

import SingleQuestionTask from './types/SingleQuestionTask.jsx';
import TextTask from './types/TextTask.jsx';

const taskTypes = {
  'multiple': SingleQuestionTask,  // Shared with single answer question task
  'single': SingleQuestionTask,
  'text': TextTask
};

function EditTaskForm({  // It's not actually a form, but a fieldset that's part of a form.
  deleteTask,
  enforceLimitedBranchingRule,
  task,
  taskKey,
  updateTask
}) {
  if (!task || !taskKey) return <li>ERROR: could not render Task</li>;

  const TaskForm = taskTypes[task.type];
  
  return (
    <fieldset
      className="edit-task-form"
    >
      <legend className="task-key">{taskKey}</legend>
      {(TaskForm)
        ? <TaskForm
            deleteTask={deleteTask}
            enforceLimitedBranchingRule={enforceLimitedBranchingRule}
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
    stepHasBranch: PropTypes.bool,
    stepHasOneTask: PropTypes.bool,
    stepHasManyTasks: PropTypes.bool
  }),
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
}

export default EditTaskForm;