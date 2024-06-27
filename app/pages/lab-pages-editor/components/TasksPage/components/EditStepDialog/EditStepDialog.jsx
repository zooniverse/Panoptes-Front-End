import { forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import EditTaskForm from './EditTaskForm.jsx';
import CloseIcon from '../../../../icons/CloseIcon.jsx';

const taskNames = {
  'drawing': 'Drawing',
  'multiple': 'Question',
  'single': 'Question',
  'text': 'Text',
}

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

  const firstTask = allTasks?.[taskKeys?.[0]]
  const taskName = taskNames[firstTask?.type] || '???';
  const stepHasManyTasks = taskKeys?.length > 1
  const title = stepHasManyTasks
    ? 'Edit A Multi-Task Page'
    : `Edit ${taskName} Task`;

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
      <div className="dialog-footer flex-row">
        <button
          className="big flex-item"
          onClick={handleClickAddTaskButton}
          type="button"
        >
          Add another Task to this Page
        </button>
        <button
          className="big done"
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
