import { forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '../../../icons/CloseIcon.jsx';
import TaskIcon from '../../../icons/TaskIcon.jsx';
// import strings from '../../../strings.json'; // TODO: move all text into strings

const DEFAULT_HANDLER = () => {};

function NewTaskDialog({
  addTask = DEFAULT_HANDLER,
  enforceLimitedBranchingRule,
  openEditStepDialog = DEFAULT_HANDLER,
  stepIndex = -1
}, forwardedRef) {
  const newTaskDialog = useRef(null);

  // the dialog is opened via the parent TasksPage.
  function openDialog() {
    newTaskDialog.current?.showModal();
  }

  function closeDialog() {
    newTaskDialog.current?.close();
  }

  useImperativeHandle(forwardedRef, () => {
    return {
      openDialog
    };
  });

  /*
  When an "add Task of type X" button is clicked, we add the Task and then
  open the Edit Step Dialog. This behaviour is different whether a stepIndex
  has been defined or not. (i.e. whether we're adding a Task to a new Step, or
  to an existing Step.)
   */
  async function handleClickAddTask(e) {
    const tasktype = e?.currentTarget?.dataset?.tasktype;
    // Protip: don't use event.target, since it might return the child of the button, instead of the button itself

    closeDialog();

    const addingTaskToNewStep = stepIndex < 0
    if (addingTaskToNewStep) {
      const newStepIndex = await addTask(tasktype);
      openEditStepDialog(newStepIndex);

    } else {  // Adding task to existing Step
      await addTask(tasktype, stepIndex);
      openEditStepDialog(stepIndex);
    }
  }

  // The Question Task is either a Single Answer Question Task, or a Multiple Answer Question Task.
  // By default, this is 'single', but under certain conditions, a new Question Task will be created as a Multiple Answer Question Task.
  const questionTaskType = (!enforceLimitedBranchingRule?.stepHasBranch) ? 'single' : 'multiple'

  return (
    <dialog
      aria-labelledby="dialog-title"
      className="new-task"
      ref={newTaskDialog}
      /* open="true"  // MDN recommends not using this attribute. But if we have to, use "true", not {true} */
    >
      <div className="dialog-header flex-row">
        <h4 id="dialog-title" className="flex-item">
          Choose a Task type
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
        <p>
          A task is a unit of work you are asking volunteers to do.
          You can ask them to answer a question or mark an image.
        </p>
        <div className="flex-row flex-wrap">
          <button
            aria-label="Add new Text Task"
            className="new-task-button"
            data-tasktype="text"
            onClick={handleClickAddTask}
            type="button"
          >
            <TaskIcon type='text' />
            <span>Text</span>
          </button>
          <button
            aria-label="Add new Question Task"
            className="new-task-button"
            data-tasktype={questionTaskType}
            onClick={handleClickAddTask}
            type="button"
          >
            <TaskIcon type={questionTaskType} />
            <span>Question</span>
          </button>
          <button
            aria-label="Add new Drawing Task"
            className="new-task-button"
            data-tasktype="drawing"
            onClick={handleClickAddTask}
            type="button"
          >
            <TaskIcon type='drawing' />
            <span>Drawing</span>
          </button>
        </div>
      </form>
    </dialog>
  );
}

NewTaskDialog.propTypes = {
  addTask: PropTypes.func,
  enforceLimitedBranchingRule: PropTypes.shape({
    stepHasBranch: PropTypes.bool,
    stepHasOneTask: PropTypes.bool,
    stepHasManyTasks: PropTypes.bool
  }),
  openEditStepDialog: PropTypes.func,
  stepIndex: PropTypes.number
};

function onSubmit(e) {
  e.preventDefault();
  return false;
}

export default forwardRef(NewTaskDialog);
