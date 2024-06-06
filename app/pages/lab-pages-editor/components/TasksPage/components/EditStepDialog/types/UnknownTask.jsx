import DeleteIcon from '../../../../../icons/DeleteIcon.jsx';

const DEFAULT_HANDLER = () => {};

export default function UnknownTask({
  deleteTask = DEFAULT_HANDLER,
  task,
  taskKey
}) {
  function doDelete() {
    deleteTask(taskKey);
  }

  return (
    <div className="unknown-task">
      <div className="input-row">
        <span className="big">
          Unknown Task
        </span>
        <div className="flex-row">
          <span className="task-key">{taskKey}</span>
          <span className="flex-item">
            Unknown task type: {task?.type}
          </span>
          <button
            aria-label={`Delete Task ${taskKey}`}
            className="big"
            onClick={doDelete}
            type="button"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
