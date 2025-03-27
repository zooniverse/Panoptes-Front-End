/*
Sets the primary instructions of the Task.
NOTE: Question Tasks use task.question, whereas other tasks use task.instructions
 */

import PropTypes from 'prop-types'

import DeleteIcon from '../../../../../icons/DeleteIcon.jsx'

const DEFAULT_HANDLER = () => {}

function TaskInstructionField ({
  deleteTask = DEFAULT_HANDLER,
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
          Instructions
        </label>
      </div>
      <div className="task-field-row">
        <textarea
          className="flex-item"
          id={`task-${taskKey}-instruction`}
          type="text"
          value={value}
          onBlur={update}
          onChange={(e) => { setValue(e?.target?.value) }}
        />
        {showDeleteButton && (
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
  setValue: PropTypes.func,
  showDeleteTaskButton: PropTypes.bool,
  update: PropTypes.func,
  taskKey: PropTypes.string,
  value: PropTypes.string,
}

export default TaskInstructionField
