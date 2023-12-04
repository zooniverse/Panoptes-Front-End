import { useEffect, useState } from 'react';

export default function TextTask({
  task,
  taskKey,
  updateTask = () => {}
}) {
  const [ help, setHelp ] = useState(task?.help || '');
  const [ instruction, setInstruction ] = useState(task?.instruction || '');
  const [ required, setRequired ] = useState(!!task?.required);

  // Update is usually called manually onBlur, after user input is complete.
  function update() {
    const newTask = {
      ...task,
      help,
      instruction,
      required
    };
    updateTask(taskKey, newTask);
  }

  // For inputs that don't have onBlur, update triggers automagically.
  // (You can't call update() in the onChange() right after setStateValue().)
  useEffect(update, [required]);

  return (
    <div>
      <div>
        <label>Main Text</label>
        <div className="flex-row">
          <input
            className="flex-item"
            value={instruction}
            onBlur={update}
            onChange={(e) => { setInstruction(e?.target?.value) }}
          />
          <button>Delete</button>
        </div>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => {
              setRequired(!!e?.target?.checked);
            }}
          />
          Required
        </label>
      </div>
      <div>
        <label>Help Text</label>
        <textarea
          value={help}
          onBlur={update}
          onChange={(e) => { setHelp(e?.target?.value) }}
        />
      </div>
    </div>
  );
}
