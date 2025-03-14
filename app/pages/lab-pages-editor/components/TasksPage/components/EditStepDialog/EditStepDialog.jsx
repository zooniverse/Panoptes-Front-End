import { forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import EditTaskForm from './EditTaskForm.jsx';
import CloseIcon from '../../../../icons/CloseIcon.jsx';
import OptionsIcon from '../../../../icons/OptionsIcon.jsx';

const DEFAULT_HANDLER = () => {};

function EditStepDialog({
  allTasks = {},
  deleteTask,
  enforceLimitedBranchingRule,
  onClose = DEFAULT_HANDLER,
  openNewTaskDialog = DEFAULT_HANDLER,
  step = [],
  stepIndex = -1,
  updateTask
}, forwardedRef) {
  const [ stepKey, stepBody ] = step;
  const taskKeys = stepBody?.taskKeys || [];
  const editStepDialog = useRef(null);

  useImperativeHandle(forwardedRef, () => {
    return {
      closeDialog,
      openDialog
    };
  });

  // the dialog is opened via the parent TasksPage.
  function openDialog() {
    editStepDialog.current?.showModal();
  }

  function closeDialog() {
    onClose();
    editStepDialog.current?.close();
  }

  function handleClickAddTaskButton() {
    openNewTaskDialog(stepIndex);
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
        <button
          aria-label="Options"
          className="plain"
          onClick={null}
          type="button"
        >
          <OptionsIcon />
        </button>
        <button
          aria-label="Close dialog"
          className="plain"
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
          const task = allTasks[taskKey];
          return (
            <EditTaskForm
              key={`editTaskForm-${taskKey}`}
              deleteTask={deleteTask}
              enforceLimitedBranchingRule={enforceLimitedBranchingRule}
              isFirstTaskInStep={index === 0}
              stepHasManyTasks={stepHasManyTasks}
              task={task}
              taskKey={taskKey}
              taskIndexInStep={index}
              updateTask={updateTask}
            />
          );
        })}
      </form>
      <div className="dialog-footer">
        <button
          className="button add-task-button"
          onClick={handleClickAddTaskButton}
          type="button"
        >
          Add another Task to this Page
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
          onClick={handleClickAddTaskButton}
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
  );
}

EditStepDialog.propTypes = {
  allTasks: PropTypes.object,
  deleteTask: PropTypes.func,
  enforceLimitedBranchingRule: PropTypes.shape({
    stepHasBranch: PropTypes.bool
  }),
  onClose: PropTypes.func,
  step: PropTypes.object,
  stepIndex: PropTypes.number,
  updateTask: PropTypes.func
};

function onSubmit(e) {
  e.preventDefault();
  return false;
}

export default forwardRef(EditStepDialog);
