import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import DeleteIcon from '../../../../../icons/DeleteIcon.jsx'
import TaskHelpField from '../TaskHelpField.jsx'

const DEFAULT_HANDLER = () => {};

function TextTask({
  deleteTask = DEFAULT_HANDLER,
  isFirstTaskInStep = true,
  stepHasManyTasks = false,
  task,
  taskKey,
  updateTask = DEFAULT_HANDLER
}) {
  const [ help, setHelp ] = useState(task?.help || '');
  const [ instruction, setInstruction ] = useState(task?.instruction || '');
  const [ required, setRequired ] = useState(!!task?.required);
  const title = stepHasManyTasks ? 'Text Task' : 'Main Text';
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

  function doDelete() {
    deleteTask(taskKey);
  }

  const [ showHelpField, setShowHelpField ] = useState(isFirstTaskInStep || task?.help?.length > 0);
  function toggleShowHelpField() {
    setShowHelpField(!showHelpField);
  }

  // For inputs that don't have onBlur, update triggers automagically.
  // (You can't call update() in the onChange() right after setStateValue().)
  // TODO: useEffect() means update() is called on the first render, which is unnecessary. Clean this up.
  useEffect(update, [required]);

  return (
    <div className="text-task">
      <div className="field-block">
        <label
          className="big spacing-bottom-S"
          htmlFor={`task-${taskKey}-instruction`}
        >
          {title}
        </label>
        <div className="flex-row">
          <span className="task-key">{taskKey}</span>
          <input
            className="flex-item"
            id={`task-${taskKey}-instruction`}
            type="text"
            value={instruction}
            onBlur={update}
            onChange={(e) => { setInstruction(e?.target?.value) }}
          />
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
      <div className="field-block">
        <span className="narrow">
          <input
            id={`task-${taskKey}-required`}
            type="checkbox"
            checked={required}
            onChange={(e) => {
              setRequired(!!e?.target?.checked);
            }}
          />
          <label htmlFor={`task-${taskKey}-required`}>
            Required
          </label>
        </span>
      </div>
      <TaskHelpField
        help={help}
        setHelp={setHelp}
        showHelpField={showHelpField}
        taskKey={taskKey}
        toggleShowHelpField={toggleShowHelpField}
        update={update}
      />
    </div>
  );
}

TextTask.propTypes = {
  deleteTask: PropTypes.func,
  isFirstTaskInStep: PropTypes.bool,
  stepHasManyTasks: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
};

export default TextTask;