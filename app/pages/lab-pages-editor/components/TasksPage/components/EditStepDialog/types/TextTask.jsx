import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import TaskHeader from '../components/TaskHeader.jsx'
import TaskInstructionField from '../components/TaskInstructionField.jsx'
import TaskHelpField from '../components/TaskHelpField.jsx'

const DEFAULT_HANDLER = () => {}

function TextTask({
  deleteTask = DEFAULT_HANDLER,
  stepHasManyTasks = false,
  task,
  taskKey,
  updateTask = DEFAULT_HANDLER
}) {
  const [ help, setHelp ] = useState(task?.help || '')
  const [ instruction, setInstruction ] = useState(task?.instruction || '')
  const [ required, setRequired ] = useState(!!task?.required)
  const title = 'Text Task'
  // Update is usually called manually onBlur, after user input is complete.
  function update() {
    const newTask = {
      ...task,
      help,
      instruction,
      required
    }
    updateTask(taskKey, newTask)
  }

  function doDelete() {
    deleteTask(taskKey)
  }

  // For inputs that don't have onBlur, update triggers automagically.
  // (You can't call update() in the onChange() right after setStateValue().)
  // TODO: useEffect() means update() is called on the first render, which is unnecessary. Clean this up.
  useEffect(update, [required])

  return (
    <div className="text-task">
      <TaskHeader
        task={task}
        taskKey={taskKey}
        title={title}
      >
        <p>The volunteer types into a free-text entry field. Can be combined with other tasks on a page.</p>
      </TaskHeader>

      <TaskInstructionField
        deleteTask={deleteTask}
        setValue={setInstruction}
        showDeleteButton={stepHasManyTasks}
        taskKey={taskKey}
        update={update}
        value={instruction}
      >
        <span className="spacer" />
        <span className="task-field-checkbox-set">
          <input
            id={`task-${taskKey}-required`}
            type="checkbox"
            checked={required}
            onChange={(e) => {
              setRequired(!!e?.target?.checked)
            }}
          />
          <label htmlFor={`task-${taskKey}-required`}>
            Required
          </label>
        </span>
      </TaskInstructionField>

      <TaskHelpField
        help={help}
        setHelp={setHelp}
        taskKey={taskKey}
        update={update}
      />
    </div>
  )
}

TextTask.propTypes = {
  deleteTask: PropTypes.func,
  stepHasManyTasks: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
}

export default TextTask