import { useState } from 'react'
import PropTypes from 'prop-types'

import AddItemIcon from '../../../../../../icons/AddItemIcon.jsx'

import TaskHeader from '../../components/TaskHeader.jsx'
import TaskInstructionField from '../../components/TaskInstructionField.jsx'
import TaskHelpField from '../../components/TaskHelpField.jsx'

import DrawingTool, { randomlySelectColor } from './DrawingTool.jsx'

function DrawingTask({
  deleteTask = DEFAULT_HANDLER,
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

  // update() gets the latest Task data and prepares for all the changes to be
  // committed. There are two ways the latest Task data is update()-ed:
  // 1. for data fields with onBlur (e.g. "Instructions" text input), we can
  //    pull the values from the React state. (i.e. the useState() value)
  // 2. for everything else (e.g. "is Required" checkbox), the
  //    optionalStateOverrides must be set for that data field 
  //    (e.g. optionalStateOverrides = { required: true })
  // This is because React state changes only really register _before_ onBlur,
  // but _after_ onChange.
  // Not to be confused with updateTask(), which actually performs the commit,
  // and which update() calls.
  function update(optionalStateOverrides) {
    const _tools = optionalStateOverrides?.tools ?? tools
    // const nonEmptyTools = _tools.filter(({ label }) => label.trim().length > 0)

    const newTask = {
      ...task,
      type: 'drawing',
      tools: _tools,
      help,
      instruction,
      required: false,  // On PFE/FEM Lab, this can't be changed.
      enableHidePrevMarks: optionalStateOverrides?.prevMarks ?? prevMarks
    }
    updateTask(taskKey, newTask)
  }

  function togglePrevMarks(e) {
    const val = !!e?.currentTarget?.checked
    setPrevMarks(val)
    update({ prevMarks: val })
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
    update({ tools: newTools })

    e.preventDefault()
    return false
  }

  function editTool(index, field, value, commit = true) {
    if (index === undefined || index < 0 || index >= tools.length) return

    const tool = structuredClone(tools[index]) || {}  // Copy target tool.

    switch (field) {
      case 'label':
      case 'type':
      case 'color':
      case 'size':
        tool[field] = value || ''
        break
      
      case 'details':
        tool[field] = value || []
        break
      
      case 'min':
      case 'max':
        tool[field] = parseInt(value) || undefined
        if (tool.min !== undefined && tool.max !== undefined && tool.max < tool.min) {
          tool.max = tool.min
        }
        break
    }

    const newTools = tools.with(index, tool)
    setTools(newTools)
    commit && update({ tools: newTools })
  }

  function deleteTool(index) {
    if (index === undefined || index < 0 || index >= tools.length) return

    const newTools = tools.slice()  // Copy tools.
    newTools.splice(index, 1)
    setTools(newTools)
    update({ tools: newTools })
  }

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
              onChange={togglePrevMarks}
            />
            <label htmlFor={`task-${taskKey}-prevMarks`}>
              Allow hiding of marks
            </label>
          </span>
        </div>
      
        <ul className="task-tools-list">
          {tools.map((tool, index) => (
            <DrawingTool
              key={`drawing-task-tool-${index}`}
              index={index}
              taskKey={taskKey}
              tool={tool}
              editTool={editTool}
              deleteTool={deleteTool}
            />
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
        taskKey={taskKey}
        update={update}
      />
    </div>
  )
}

DrawingTask.propTypes = {
  deleteTask: PropTypes.func,
  stepHasManyTasks: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
}

export default DrawingTask