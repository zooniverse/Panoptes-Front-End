import TextTask from './types/TextTask.jsx';

const taskTypes = {
  'text': TextTask
};

export default function EditTaskForm({  // It's not actually a form, but a fieldset that's part of a form.
  task,
  taskKey
}) {
  if (!task || !taskKey) return <li>ERROR: could not render Task</li>;

  const TaskForm = taskTypes[task.type];

  return (
    <fieldset
      className="edit-task-form"
    >
      <legend>{taskKey}</legend>
      {(TaskForm)
        ? <TaskForm />
        : null
      }
    </fieldset>
  );
}


