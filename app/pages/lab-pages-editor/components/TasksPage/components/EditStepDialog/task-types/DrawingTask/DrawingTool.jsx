import createTask from '../../../../../../helpers/createTask.js'
import DrawingToolIcon from '../../../../../../icons/DrawingToolIcon.jsx'
import DeleteIcon from '../../../../../../icons/DeleteIcon.jsx'
import SubTaskSubForm from './SubTaskSubForm.jsx'
import TOOL_COLOR_OPTIONS from '../../../../../../../../constants/toolColors.js'

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

export function randomlySelectColor() {
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

const DEFAULT_HANDLER = () => {}

export default function DrawingTool({
  index,
  taskKey,
  tool,
  editTool = DEFAULT_HANDLER,
  deleteTool = DEFAULT_HANDLER,
}) {

  const { color, details, label, max, min, size, type } = tool

  function _editTool(e) {
    const index = e?.currentTarget?.dataset?.index
    const field = e?.currentTarget?.dataset?.field
    const value = e?.currentTarget?.value
    editTool(index, field, value)

    e.preventDefault()
    return false
  }

  function _editToolWithoutCommit(e) {
    const index = e?.currentTarget?.dataset?.index
    const field = e?.currentTarget?.dataset?.field
    const value = e?.currentTarget?.value
    editTool(index, field, value, false)

    e.preventDefault()
    return false
  }

  function _deleteTool(e) {
    const index = e?.currentTarget?.dataset?.index
    deleteTool(index)

    e.preventDefault()
    return false
  }

  function addSubTask(e) {
    const subTaskType = e?.currentTarget.value
    const newSubTask = createTask(subTaskType)
    if (!newSubTask) return  // Throw error, perhaps?

    const newDetails = structuredClone(details) || []
    newDetails.push(newSubTask)
    editTool(index, 'details', newDetails)

    e.preventDefault()
    return false
  }

  function updateSubTask(subTaskIndex = '', subTask) {
    const _subTaskIndex = parseInt(subTaskIndex)
    if (!Number.isInteger(_subTaskIndex)
      || _subTaskIndex < 0
      || _subTaskIndex >= details?.length
      || !Array.isArray(details)
    ) return

    const newDetails = details.with(_subTaskIndex, subTask)   
    editTool(index, 'details', newDetails)
  }

  function deleteSubTask(subTaskIndex = '') {
    const _subTaskIndex = parseInt(subTaskIndex)
    if (!Number.isInteger(_subTaskIndex)
      || _subTaskIndex < 0
      || _subTaskIndex >= details?.length
      || !Array.isArray(details)
    ) return

    const newDetails = details.toSpliced(_subTaskIndex, 1)  // Copy then delete Subtask at index
    editTool(index, 'details', newDetails)
  }

  return (
    <li
      className="task-tool"
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
              onBlur={_editTool}
              onChange={_editToolWithoutCommit}
              type="text"
              value={label}
              data-index={index}
              data-field="label"
            />
            <button
              aria-label={`Delete tool ${index}`}
              onClick={_deleteTool}
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
              onChange={_editTool}
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
              onChange={_editTool}
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
            max={max || undefined}
            min="0"
            onBlur={_editTool}
            onChange={_editToolWithoutCommit}
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
            onBlur={_editTool}
            onChange={_editToolWithoutCommit}
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
              onChange={_editTool}
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
            onChange={addSubTask}
            value={''}
            data-index={index}
            data-field="subtask"
          >
            <option value="">Add a sub-task +</option>
            <option value="single">Question sub-task</option>
            <option value="text">Text sub-task</option>
            {/*<option value="dropdown">Dropdown sub-task</option>*/}
          </select>
        </div>
      </div>
      {(details?.length > 0) && (
        <ul className="subtasks-list">
          {details.map((detail, index) => {
            // We need a unique React key, but drawingTask.tools[x].details[y]
            // doesn't have a unique identifier! There's no corresponding task
            // key, and generating temporary IDs would require scrubbing before
            // sending the deets to Panoptes.
            // The following is a compromise that keeps re-rendering the
            // subtask, but keeps the keys unique enough
            const inefficientReactKey = `subtask-${index}-${detail?.type}-${detail?.instruction || detail?.question}`

            return (
              <SubTaskSubForm
                key={inefficientReactKey}
                deleteTask={deleteSubTask}
                subTaskIndex={`${index}`}
                task={detail}
                updateTask={updateSubTask}
              />
            )
          })}
        </ul>
      )}
    </li>
  )
}