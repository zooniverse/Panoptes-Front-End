/*
Sets the primary instructions of the Task.
NOTE: Question Tasks use task.question, whereas other tasks use task.instructions
 */

import PropTypes from 'prop-types'

import DeleteIcon from '../../../../../icons/DeleteIcon.jsx'

const DEFAULT_HANDLER = () => {}

function TaskInstructionField ({
  children,  // Children will appear next to the "Instructions" label. Used normally to add the "required" checkbox.
  deleteTask = DEFAULT_HANDLER,
  isSubTask = false,
  label = 'Instructions',
  setValue = DEFAULT_HANDLER,
  showDeleteButton = false,
  taskKey = '',
  update = DEFAULT_HANDLER,
  value = '',
}) {

  function doDelete() {
    deleteTask(taskKey)
  }

  return (
    <div className="task-field">
      <div className="task-field-subheader">
        <label
          className="big-label"
          htmlFor={`task-${taskKey}-instruction`}
        >
          {label}
        </label>
        {children}
      </div>
      <div className="task-field-row">
        <textarea
          className="flex-item"
          id={`task-${taskKey}-instruction`}
          type="text"
          value={value}
          onBlur={update}
          onChange={(e) => { setValue(e?.currentTarget?.value) }}
        />
        {(showDeleteButton || isSubTask) && (
          <button
            aria-label={`Delete Task ${taskKey}`}
            className="delete-button"
            onClick={doDelete}
            type="button"
          >
            <DeleteIcon />
          </button>)
        }
      </div>
    </div>
  )
}

TaskInstructionField.propTypes = {
  deleteTask: PropTypes.func,
  isSubTask: PropTypes.bool,
  label: PropTypes.string,
  setValue: PropTypes.func,
  showDeleteTaskButton: PropTypes.bool,
  update: PropTypes.func,
  taskKey: PropTypes.string,
  value: PropTypes.string,
}

export default TaskInstructionField
