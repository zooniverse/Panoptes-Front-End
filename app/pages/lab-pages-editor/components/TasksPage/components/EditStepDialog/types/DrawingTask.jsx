import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import CollapseIcon from '../../../../../icons/CollapseIcon.jsx';
import DeleteIcon from '../../../../../icons/DeleteIcon.jsx';
import DrawingToolIcon from '../../../../../icons/DrawingToolIcon.jsx';
import ExpandIcon from '../../../../../icons/ExpandIcon.jsx';
import MinusIcon from '../../../../../icons/MinusIcon.jsx';
import PlusIcon from '../../../../../icons/PlusIcon.jsx';

const DEFAULT_HANDLER = () => {};

const TOOL_COLOR_OPTIONS = [
  { value: '#ff0000', label: 'Red' },
  { value: '#ffff00', label: 'Yellow' },
  { value: '#00ff00', label: 'Green' },
  { value: '#00ffff', label: 'Cyan' },
  { value: '#0000ff', label: 'Blue' },
  { value: '#ff00ff', label: 'Magenta' }
];

const TOOL_TYPE_OPTIONS = [
  // Supported in PFE/FEM Lab and works in FEM Classifier:
  'circle',
  'ellipse',
  'line',
  'point',
  'polygon',
  'rectangle',
  'rotateRectangle',

  // Supported in PFE/FEM Lab, but doesn't work in FEM Classifier:
  //'bezier',
  //'column',
  //'fullWidthLine',
  //'fullHeightLine',
  //'triangle',
  //'pointGrid'

  // Only available via experimental tools 
  // TODO: figure out which ones of these should be standard.
  // 'grid',
  // 'freehandLine',  <-- Maybe this one?
  // 'freehandShape',
  // 'freehandSegmentLine',
  // 'freehandSegmentShape',
  // 'anchoredEllipse',
  // 'fan',
  // 'transcriptionLine',
  // 'temporalPoint',
  // 'temporalRotateRectangle'
];

function DrawingTask({
  deleteTask = DEFAULT_HANDLER,
  isFirstTaskInStep = true,
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
      label: 'Tool name',
      max: undefined,
      min: undefined,
      size: undefined,
      type: 'point'
    }];
    setTools(newTools);

    e.preventDefault();
    return false;
  }

  function editTool(e) {
    const index = e?.target?.dataset?.index;
    const field = e?.target?.dataset?.field;
    const value = e?.target?.value;
    if (index === undefined || index < 0 || index >= tools.length) return;

    const tool = structuredClone(tools[index]) || {};  // Copy target tool.

    switch (field) {
      case 'label':
      case 'type':
      case 'color':
      case 'size':
        tool[field] = value || '';
        break;
      
      case 'min':
      case 'max':
        tool[field] = parseInt(value) || undefined;
        if (tool.min !== undefined && tool.max !== undefined && tool.max < tool.min) {
          tool.max = tool.min;
        }
        break;
    }

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

  const [ showHelpField, setShowHelpField ] = useState(isFirstTaskInStep || task?.help?.length > 0);
  function toggleShowHelpField() {
    setShowHelpField(!showHelpField);
  }

  // For inputs that don't have onBlur, update triggers automagically.
  // (You can't call update() in the onChange() right after setStateValue().)
  // TODO: useEffect() means update() is called on the first render, which is unnecessary. Clean this up.
  useEffect(update, [tools, prevMarks]);

  // TODO: DEBOUNCE FOR tools UPDATE, since typing into the Tool Name/Label causes way too many updates!

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
            onChange={(e) => { setPrevMarks(!!e?.target?.checked); }}
          />
          <label htmlFor={`task-${taskKey}-prevMarks`}>
            Allow hiding of marks
          </label>
        </span>
      </div>
      <div className="input-row">
        <ul>
          {tools.map(({ color, details, label, max, min, size, type }, index) => (
            <li
              key={`drawing-task-tool-${index}`}
            >
              <label htmlFor={`task-${taskKey}-tool-${index}-label`}>
                Tool Name
              </label>
              <div className="flex-row">
                <input
                  id={`task-${taskKey}-tool-${index}-label`}
                  onChange={editTool}
                  type="text"
                  value={label}
                  data-index={index}
                  data-field="label"
                />
                <button
                  aria-label={`Delete tool ${index}`}
                  onClick={deleteTool}
                  className="big"
                  data-index={index}
                  type="button"
                >
                  <MinusIcon data-index={index} />
                </button>
              </div>
              <div className="grid">
                <div className="grid-item grid-item-1">
                  <label htmlFor={`task-${taskKey}-tool-${index}-type`}>Tool Type</label>
                  <div className="flex-row with-preview">
                    <DrawingToolIcon type={type} />
                    <select
                      id={`task-${taskKey}-tool-${index}-type`}
                      onChange={editTool}
                      value={type}
                      data-index={index}
                      data-field="type"
                    >
                      {TOOL_TYPE_OPTIONS.map(typeOption => (
                        <option value={typeOption} key={typeOption}>
                          {typeOption}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid-item grid-item-2">
                  <label htmlFor={`task-${taskKey}-tool-${index}-color`}>Color</label>
                  <div className="flex-row with-preview">
                    <div className="preview-box" style={{ background: color }}>&nbsp;</div>
                    <select
                      id={`task-${taskKey}-tool-${index}-color`}
                      onChange={editTool}
                      value={color}
                      data-index={index}
                      data-field="color"
                    >
                      {TOOL_COLOR_OPTIONS.map(colorOption => (
                        <option value={colorOption.value} key={colorOption.value}>
                          {colorOption.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid-item grid-item-3">
                  <label htmlFor={`task-${taskKey}-tool-${index}-min`}>Min</label>
                  <input
                    id={`task-${taskKey}-tool-${index}-min`}
                    inputMode="numeric"
                    min="0"
                    onChange={editTool}
                    placeholder="0"
                    type="number"
                    value={(min !== undefined) ? min : ''}
                    data-index={index}
                    data-field="min"
                  />
                </div>
                <div className="grid-item grid-item-4">
                  <label htmlFor={`task-${taskKey}-tool-${index}-min`}>Max</label>
                  <input
                    id={`task-${taskKey}-tool-${index}-max`}
                    inputMode="numeric"
                    min={min || 0}
                    onChange={editTool}
                    placeholder="∞"
                    type="number"
                    value={(max !== undefined) ? max : ''}
                    data-index={index}
                    data-field="max"
                  />
                </div>
                {(type === 'point') && (
                  <div className="grid-item grid-item-5">
                    <label htmlFor={`task-${taskKey}-tool-${index}-size`}>Size</label>
                    <select
                      id={`task-${taskKey}-tool-${index}-size`}
                      onChange={editTool}
                      value={size || 'large'}
                      data-index={index}
                      data-field="size"
                    >
                      <option value="small">Small</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="input-row flex-row">
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
        <div className="flex-row spacing-bottom-S">
          <label
            className="medium"
            htmlFor={`task-${taskKey}-help`}
          >
            Help Text
          </label>
          <button
            aria-label={`Show/Hide Help field`}
            aria-controls={`task-${taskKey}-help`}
            aria-expanded={showHelpField ? 'true' : 'false'}
            className="plain"
            onClick={toggleShowHelpField}
            type="button"
          >
            {showHelpField
              ? <CollapseIcon />
              : <ExpandIcon />
            }
          </button>
        </div>
        <textarea
          id={`task-${taskKey}-help`}
          hidden={!showHelpField}
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
  isFirstTaskInStep: PropTypes.bool,
  stepHasManyTasks: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
};

export default DrawingTask;