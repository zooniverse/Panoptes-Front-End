import SingleQuestionTask from './types/SingleQuestionTask.jsx';
import TextTask from './types/TextTask.jsx';

const taskTypes = {
  'multiple': SingleQuestionTask,  // Shared with single answer question task
  'single': SingleQuestionTask,
  'text': TextTask
};

export default function EditTaskForm({  // It's not actually a form, but a fieldset that's part of a form.
  deleteTask,
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
            task={task}
            taskKey={taskKey}
            updateTask={updateTask}
          />
        : null
      }
    </fieldset>
  );
}


