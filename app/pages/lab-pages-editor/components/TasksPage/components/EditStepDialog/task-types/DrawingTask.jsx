import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import AddItemIcon from '../../../../../icons/AddItemIcon.jsx'
import DrawingToolIcon from '../../../../../icons/DrawingToolIcon.jsx'
import DeleteIcon from '../../../../../icons/DeleteIcon.jsx'

import TaskHeader from '../components/TaskHeader.jsx'
import TaskInstructionField from '../components/TaskInstructionField.jsx'
import TaskHelpField from '../components/TaskHelpField.jsx'

const DEFAULT_HANDLER = () => {}

const TOOL_COLOR_OPTIONS = [
  // Here are the new FEM colours.
  { value: '#E65252', label: 'Red Orange' },
  { value: '#F1AE45', label: 'Goldenrod' },
  { value: '#FCED54', label: 'Laser Lemon' },
  { value: '#EE7BCF', label: 'Cotton Candy' },
  { value: '#C7F55B', label: 'Granny Smith Apple' },
  { value: '#65EECA', label: 'Jungle Green' },
  { value: '#52DB72', label: 'Screamin\' Green' },
  { value: '#7CDFF2', label: 'Robin\'s Egg Blue' },
  { value: '#8AA0D3', label: 'Indigo' },
  { value: '#C17DDF', label: 'Violet' },
  { value: '#E7BBE3', label: 'Wisteria' },

  /*
  // And here are the old PFE colours.
  { value: '#ff0000', label: 'Red' },
  { value: '#ffff00', label: 'Yellow' },
  { value: '#00ff00', label: 'Green' },
  { value: '#00ffff', label: 'Cyan' },
  { value: '#0000ff', label: 'Blue' },
  { value: '#ff00ff', label: 'Magenta' }
  */
]

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
]

function randomlySelectColor() {
  return TOOL_COLOR_OPTIONS[Math.floor(Math.random() * TOOL_COLOR_OPTIONS.length)]
}

// Checks if a selected colour is in the list of colours. (Or color.) This is
// used in the fallback in case a tool uses a colour that's not in the list of
// colours. (Or colors.)
function isSelectedColorInListOfOptions(color) {
  return !!TOOL_COLOR_OPTIONS.find(listedColor => listedColor.value.toLowerCase() === color?.toLowerCase())
}

// Vive la langue Anglaise Britannique!
function isSelectedColourInListOfOptions(colour) { return isSelectedColorInListOfOptions(colour) }
function randomlySelectColour() { return randomlySelectColor() }
const TOOL_COLOUR_OPTIONS = TOOL_COLOR_OPTIONS

function DrawingTask({
  deleteTask = DEFAULT_HANDLER,
  isFirstTaskInStep = true,
  stepHasManyTasks = false,
  task,
  taskKey,
  updateTask = DEFAULT_HANDLER
}) {
  const [ tools, setTools ] = useState(task?.tools || [])
  const [ help, setHelp ] = useState(task?.help || '')
  const [ instruction, setInstruction ] = useState(task?.instruction || '')  // TODO: figure out if FEM is standardising Question vs Instructions
  const [ prevMarks, setPrevMarks ] = useState(!!task?.enableHidePrevMarks)
  const title = 'Drawing Task'

  // Update is usually called manually onBlur, after user input is complete.
  function update(optionalStateOverrides) {
    const _tools = optionalStateOverrides?.tools || tools
    // const nonEmptyTools = _tools.filter(({ label }) => label.trim().length > 0)

    const newTask = {
      ...task,
      type: 'drawing',
      tools: _tools,
      help,
      instruction,
      required: false,  // On PFE/FEM Lab, this can't be changed.
      enableHidePrevMarks: prevMarks
    }
    updateTask(taskKey, newTask)
  }

  function addTool(e) {
    const newTools = [ ...tools, {
      color: randomlySelectColor().value.toLowerCase(),
      details: [],
      label: 'Tool name',
      max: undefined,
      min: undefined,
      size: undefined,
      type: 'point'
    }]
    setTools(newTools)

    e.preventDefault()
    return false
  }

  function editTool(e) {
    const index = e?.target?.dataset?.index
    const field = e?.target?.dataset?.field
    const value = e?.target?.value
    if (index === undefined || index < 0 || index >= tools.length) return

    const tool = structuredClone(tools[index]) || {}  // Copy target tool.

    switch (field) {
      case 'label':
      case 'type':
      case 'color':
      case 'size':
        tool[field] = value || ''
        break
      
      case 'min':
      case 'max':
        tool[field] = parseInt(value) || undefined
        if (tool.min !== undefined && tool.max !== undefined && tool.max < tool.min) {
          tool.max = tool.min
        }
        break
    }

    setTools(tools.with(index, tool))
  }

  function deleteTool(e) {
    const index = e?.currentTarget?.dataset?.index
    if (index === undefined || index < 0 || index >= tools.length) return

    const newTools = tools.slice()  // Copy tools.
    newTools.splice(index, 1)
    setTools(newTools)
    update({ tools: newTools })  // Use optional state override, since setTools() won't reflect new values in this step of the lifecycle.
    
    e.preventDefault()
    return false
  }

  const [ showHelpField, setShowHelpField ] = useState(isFirstTaskInStep || task?.help?.length > 0)
  function toggleShowHelpField() {
    setShowHelpField(!showHelpField)
  }

  // For inputs that don't have onBlur, update triggers automagically.
  // (You can't call update() in the onChange() right after setStateValue().)
  // TODO: useEffect() means update() is called on the first render, which is unnecessary. Clean this up.
  useEffect(update, [tools, prevMarks])

  // TODO: DEBOUNCE FOR tools UPDATE, since typing into the Tool Name/Label causes way too many updates!

  return (
    <div className="drawing-task">
      <TaskHeader
        task={task}
        taskKey={taskKey}
        title={title}
      >
        <p>The volunteer draws or marks directly on the subject using the specified tools. Can be used in tandem with a sub-task. Can be combined with other tasks on a page.</p>
      </TaskHeader>

      <TaskInstructionField
        deleteTask={deleteTask}
        setValue={setInstruction}
        showDeleteButton={stepHasManyTasks}
        taskKey={taskKey}
        update={update}
        value={instruction}
      />

      <div className="task-field">
        <div className="task-field-subheader">
          <label className="big-label">
            Tool Configuration
          </label>
          <span className="spacer" />
          <span className="task-field-checkbox-set">
            <input
              id={`task-${taskKey}-prevMarks`}
              type="checkbox"
              checked={prevMarks}
              onChange={(e) => { setPrevMarks(!!e?.target?.checked) }}
            />
            <label htmlFor={`task-${taskKey}-prevMarks`}>
              Allow hiding of marks
            </label>
          </span>
        </div>
      
        <ul>
          {tools.map(({ color, details, label, max, min, size, type }, index) => (
            <li
              className='task-tool'
              key={`drawing-task-tool-${index}`}
              style={(color) ? { borderTopColor: color } : null}
            >
              <div className="grid">
                <div className="grid-item grid-item-0">
                  <label htmlFor={`task-${taskKey}-tool-${index}-label`}>
                    Tool {index+1}
                  </label>
                  <div>
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
                      className="delete-button"
                      data-index={index}
                      type="button"
                    >
                      <DeleteIcon data-index={index} />
                    </button>
                  </div>
                </div>
                <div className="grid-item grid-item-1">
                  <label htmlFor={`task-${taskKey}-tool-${index}-type`}>Tool Type</label>
                  <div>
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
                  <div>
                    <div className="preview-box" style={{ background: color }}>&nbsp;</div>
                    <select
                      id={`task-${taskKey}-tool-${index}-color`}
                      onChange={editTool}
                      value={color?.toLowerCase()}
                      data-index={index}
                      data-field="color"
                    >
                      {TOOL_COLOR_OPTIONS.map(colorOption => (
                        <option value={colorOption.value.toLowerCase()} key={colorOption.value.toLowerCase()}>
                          {colorOption.label}
                        </option>
                      ))}
                      {/* Fallback: in case colour selected is not in list */}
                      {!isSelectedColorInListOfOptions(color) && (
                        <option value={color?.toLowerCase()} key={color?.toLowerCase()}>
                          {color}
                        </option>
                      )}
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
                <div className="grid-item grid-item-6">
                  <label htmlFor={`task-${taskKey}-tool-${index}-subtask`}>Sub-task</label>
                  <select
                    id={`task-${taskKey}-tool-${index}-subtask`}
                    onChange={DEFAULT_HANDLER}
                    value={''}
                    data-index={index}
                    data-field="subtask"
                  >
                    <option value="">Add a sub-task +</option>
                    <option value="single">Question sub-task</option>
                    <option value="text">Text sub-task</option>
                    <option value="dropdown">Dropdown sub-task</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
          <li className="decorated-prompt">
            <span className="decoration-line" />
            <button
              onClick={addTool}
              type="button"
            >
              Add a tool
              <AddItemIcon />
            </button>
            <span className="decoration-line" />
          </li>
        </ul>
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
  )
}

DrawingTask.propTypes = {
  deleteTask: PropTypes.func,
  isFirstTaskInStep: PropTypes.bool,
  stepHasManyTasks: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
}

export default DrawingTask