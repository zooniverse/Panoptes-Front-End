export default function TextTask({
  task,
  taskKey
}) {
  return (
    <div>
      <div>
        <label>Main Text</label>
        <div className="flex-row">
          <input
            className="flex-item"
          />
          <button>Delete</button>
        </div>
      </div>
      <div>
        <label>
          <input type="checkbox" />
          Required
        </label>
      </div>
      <div>
        <label>Help Text</label>
        <textarea />
      </div>
    </div>
  );
}
