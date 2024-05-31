import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

import EditTaskForm from './EditTaskForm.jsx'
import CloseIcon from '../../../../icons/CloseIcon.jsx'
import OptionsIcon from '../../../../icons/OptionsIcon.jsx'

const DEFAULT_HANDLER = () => {}

function EditStepDialogWithRef({
  allTasks = {},
  copyStep = DEFAULT_HANDLER,
  deleteStep = DEFAULT_HANDLER,
  deleteTask,
  enforceLimitedBranchingRule,
  onClose = DEFAULT_HANDLER,
  openNewTaskDialog = DEFAULT_HANDLER,
  step = [],
  stepIndex = -1,
  updateTask
}, forwardedRef) {
  const [ stepKey, stepBody ] = step
  const [ showOptions, setShowOptions] = useState(false)
  const taskKeys = stepBody?.taskKeys || []
  const editStepDialog = useRef(null)

  useImperativeHandle(forwardedRef, () => {
    return {
      closeDialog,
      openDialog
    }
  })

  function onLoad () {
    setShowOptions(false)
  }
  useEffect(onLoad, [stepIndex])

  // the dialog is opened via the parent TasksPage.
  function openDialog() {
    editStepDialog.current?.showModal()
  }

  function closeDialog() {
    onClose()
    editStepDialog.current?.close()
  }

  function doAddTask() {
    openNewTaskDialog(stepIndex)
  }

  function doCopyStep() {
    copyStep(stepIndex)
  }

  function doDeleteStep() {
    deleteStep(stepIndex)
  }

  function toggleShowOptions () {
    setShowOptions(!showOptions)
  }

  const stepHasManyTasks = taskKeys?.length > 1

  return (
    <dialog
      className="edit-step"
      ref={editStepDialog}
      /* open="true"  // MDN recommends not using this attribute. But if we have to, use "true", not {true} */
    >
      <div className="dialog-header">
        <span className="step-label">Page {stepIndex + 1}</span>
        <span className="spacer" />
        <span className="edit-step-options">
          <button
            aria-label="Options"
            onClick={toggleShowOptions}
            type="button"
          >
            <OptionsIcon />
          </button>
          <ul className="edit-step-options-submenu" hidden={!showOptions}>
            <li>
              <button onClick={doDeleteStep} type="button">
                Delete Page
              </button>  
            </li>
            <li>
              <button onClick={doCopyStep} type="button">
                Duplicate Page
              </button>  
            </li>
          </ul>
        </span>
        <button
          aria-label="Close dialog"
          onClick={closeDialog}
          type="button"
        >
          <CloseIcon />
        </button>
      </div>
      <form
        className="dialog-body"
        onSubmit={onSubmit}
      >
        {taskKeys.map((taskKey, index) => {
          const task = allTasks[taskKey]
          return (
            <EditTaskForm
              key={`editTaskForm-${taskKey}`}
              deleteTask={deleteTask}
              enforceLimitedBranchingRule={enforceLimitedBranchingRule}
              stepHasManyTasks={stepHasManyTasks}
              task={task}
              taskKey={taskKey}
              updateTask={updateTask}
            />
          )
        })}
      </form>
      <div className="dialog-footer">
        <button
          className="button add-task-button"
          onClick={doAddTask}
          type="button"
        >
          Add another task to this page
        </button>
        <button
          className="button done-button"
          onClick={closeDialog}
          type="button"
        >
          Done
        </button>
      </div>
      {/*
      <div className="dialog-footer">
        <button
          className="button cancel-button"
          onClick={doAddTask}
          type="button"
        >
          Cancel
        </button>
        <button
          className="button apply-button"
          onClick={closeDialog}
          type="button"
        >
          Apply
        </button>
      </div>
      */}
    </dialog>
  )
}

const EditStepDialog = forwardRef(EditStepDialogWithRef);

EditStepDialog.propTypes = {
  allTasks: PropTypes.object,
  copyStep:PropTypes.func,
  deleteStep: PropTypes.func,
  deleteTask: PropTypes.func,
  enforceLimitedBranchingRule: PropTypes.shape({
    stepHasBranch: PropTypes.bool
  }),
  onClose: PropTypes.func,
  step: PropTypes.object,
  stepIndex: PropTypes.number,
  updateTask: PropTypes.func
}

function onSubmit(e) {
  e.preventDefault()
  return false
}

export default EditStepDialog
