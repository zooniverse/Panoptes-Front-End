import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import DeleteIcon from '../../../../../icons/DeleteIcon.jsx';
import MinusIcon from '../../../../../icons/MinusIcon.jsx';
import PlusIcon from '../../../../../icons/PlusIcon.jsx';

const DEFAULT_HANDLER = () => {};

function DrawingTask({
  deleteTask = DEFAULT_HANDLER,
  stepHasManyTasks = false,
  task,
  taskKey,
  updateTask = DEFAULT_HANDLER
}) {
  const [ tools, setTools ] = useState(task?.tools || []);
  const [ help, setHelp ] = useState(task?.help || '');
  const [ instruction, setInstruction ] = useState(task?.instruction || '');  // TODO: figure out if FEM is standardising Question vs Instructions
  const [ prevMarks, setPrevMarks ] = useState(!!task?.enableHidePrevMarks);
  const title = stepHasManyTasks ? 'Drawing Task' : 'Main Text';

  // Update is usually called manually onBlur, after user input is complete.
  function update(optionalStateOverrides) {
    const _tools = optionalStateOverrides?.tools || tools
    // const nonEmptyTools = _tools.filter(({ label }) => label.trim().length > 0);

    const newTask = {
      ...task,
      type: 'drawing',
      tools: _tools,
      help,
      instruction,
      required: false,  // On PFE/FEM Lab, this can't be changed.
      enableHidePrevMarks: prevMarks
    };
    updateTask(taskKey, newTask);
  }

  function doDelete() {
    deleteTask(taskKey);
  }

  function addTool(e) {
    const newTools = [ ...tools, {
      color: '#00ff00',
      details: [],
      label: '',
      type: 'point'
    }];
    setTools(newTools);

    e.preventDefault();
    return false;
  }

  function editTool(e) {
    const index = e?.target?.dataset?.index;
    if (index === undefined || index < 0 || index >= tools.length) return;

    const tool = structuredClone(tools[index]) || {};  // Copy target tool.
    tool.label = e?.target?.value || '';

    setTools(tools.with(index, tool));
  }

  function deleteTool(e) {
    const index = e?.target?.dataset?.index;
    if (index === undefined || index < 0 || index >= tools.length) return;

    const newTools = tools.slice();  // Copy tools.
    newTools.splice(index, 1);
    setTools(newTools);
    update({ tools: newTools });  // Use optional state override, since setTools() won't reflect new values in this step of the lifecycle.
    
    e.preventDefault();
    return false;
  }

  // For inputs that don't have onBlur, update triggers automagically.
  // (You can't call update() in the onChange() right after setStateValue().)
  // TODO: useEffect() means update() is called on the first render, which is unnecessary. Clean this up.
  useEffect(update, [prevMarks]);

  return (
    <div className="drawing-task">
      <div className="input-row">
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
      <div className="input-row flex-row">
        <span className="big">Tool Configuration</span>
        <span className="narrow">
          <input
            id={`task-${taskKey}-prevMarks`}
            type="checkbox"
            checked={prevMarks}
            onChange={(e) => {
              setPrevMarks(!!e?.target?.checked);
            }}
          />
          <label htmlFor={`task-${taskKey}-prevMarks`}>
            Allow hiding of marks
          </label>
        </span>
      </div>
      <div className="input-row">
        <ul>
          {tools.map(({ label, next }, index) => (
            <li
              className="flex-row"
              key={`drawing-task-tool-${index}`}
            >
              <input
                aria-label={`Choice ${index}`}
                className="flex-item"
                onChange={editTool}
                onBlur={update}
                type="text"
                value={label}
                data-index={index}
              />
              <button
                aria-label={`Delete choice ${index}`}
                onClick={deleteTool}
                className="big"
                data-index={index}
                type="button"
              >
                <MinusIcon data-index={index} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="input-row">
        <button
          aria-label="Add tool"
          className="big"
          onClick={addTool}
          type="button"
        >
          <PlusIcon />
        </button>
        <span>
          Add another tool
        </span>
      </div>
      <div className="input-row">
        <label
          className="big spacing-bottom-S"
          htmlFor={`task-${taskKey}-help`}
        >
          Help Text
        </label>
        <textarea
          id={`task-${taskKey}-help`}
          value={help}
          onBlur={update}
          onChange={(e) => { setHelp(e?.target?.value) }}
        />
      </div>
    </div>
  );
}

DrawingTask.propTypes = {
  deleteTask: PropTypes.func,
  stepHasManyTasks: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
};

export default DrawingTask;