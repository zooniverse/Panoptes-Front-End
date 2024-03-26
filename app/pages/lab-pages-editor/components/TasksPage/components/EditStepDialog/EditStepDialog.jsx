import { forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import EditTaskForm from './EditTaskForm.jsx';
import CloseIcon from '../../../../icons/CloseIcon.jsx';

const taskNames = {
  'drawing': 'Drawing',
  'single': 'Single Question',
  'text': 'Text',
}

const DEFAULT_HANDLER = () => {};

function EditStepDialog({
  allTasks = {},
  onClose = DEFAULT_HANDLER,
  step = [],
  updateTask
}, forwardedRef) {
  const [ stepKey, stepBody ] = step;
  const taskKeys = stepBody?.taskKeys || [];
  const editStepDialog = useRef(null);

  // the dialog is opened via the parent TasksPage.
  function openDialog() {
    editStepDialog.current?.showModal();
  }

  function closeDialog() {
    onClose();
    editStepDialog.current?.close();
  }

  useImperativeHandle(forwardedRef, () => {
    return {
      openDialog
    };
  });

  const firstTask = allTasks?.[taskKeys?.[0]]
  const taskName = taskNames[firstTask?.type] || '???';
  const title = `Edit ${taskName} Task`;

  return (
    <dialog
      aria-labelledby="dialog-title"
      className="edit-step"
      ref={editStepDialog}
      /* open="true"  // MDN recommends not using this attribute. But if we have to, use "true", not {true} */
    >
      <div className="dialog-header flex-row">
        <span className="step-key">{stepKey}</span>
        <h4 id="dialog-title" className="flex-item">
          {title}
        </h4>
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
        {taskKeys.map((taskKey) => {
          const task = allTasks[taskKey];
          return (
            <EditTaskForm
              key={`editTaskForm-${taskKey}`}
              task={task}
              taskKey={taskKey}
              updateTask={updateTask}
            />
          );
        })}
      </form>
      <div className="dialog-footer flex-row">
        <button
          className="big flex-item"
          onClick={closeDialog}
          type="button"
        >
          Add New Task
        </button>
        <button
          className="big teal-border"
          onClick={closeDialog}
          type="button"
        >
          Done
        </button>
      </div>
    </dialog>
  );
}

EditStepDialog.propTypes = {
  allTasks: PropTypes.object,
  onClose: PropTypes.func,
  step: PropTypes.object,
  updateTask: PropTypes.func
};

function onSubmit(e) {
  e.preventDefault();
  return false;
}

export default forwardRef(EditStepDialog);
