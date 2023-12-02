export default function EditTaskForm({
  task,
  taskKey
}) {
  if (!task || !taskKey) return <li>ERROR: could not render Task</li>;

  return (
    <form
      className="edit-task-form"
    >
      {taskKey}
    </form>
  );
}
