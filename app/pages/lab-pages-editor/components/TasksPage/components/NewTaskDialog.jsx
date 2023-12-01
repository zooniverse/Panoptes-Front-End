import { forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '../../../icons/CloseIcon.jsx';
import TaskIcon from '../../../icons/TaskIcon.jsx';
// import strings from '../../../strings.json'; // TODO: move all text into strings

function NewTaskButtonAndDialog({
  addTaskWithStep = () => {}
}, forwardedRef) {
  const newTaskDialog = useRef(null);

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

  function addNewTask(e) {
    const tasktype = e?.currentTarget?.dataset?.tasktype;
    // Protip: don't use event.target, since it might return the child of the button, instead of the button itself

    closeDialog();
    addTaskWithStep(tasktype);
  }

  return (
    <dialog
      aria-labelledby="dialog-title"
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
      <form className="dialog-body new-task">
        <p>
          A task is a unit of work you are asking volunteers to do.
          You can ask them to answer a question or mark an image.
        </p>
        <div className="flex-row flex-wrap">
          <button
            aria-label="Add new Text Task"
            className="new-task-button"
            data-tasktype="text"
            onClick={addNewTask}
            type="button"
          >
            <TaskIcon type='text' />
            <span>Text</span>
          </button>
          <button
            aria-label="Add new Question Task"
            className="new-task-button"
            data-tasktype="single"
            onClick={addNewTask}
            type="button"
          >
            <TaskIcon type='single' />
            <span>Question</span>
          </button>
          <button
            aria-label="Add new Drawing Task"
            className="new-task-button"
            data-tasktype="drawing"
            onClick={addNewTask}
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

NewTaskButtonAndDialog.propTypes = {
  addTaskWithStep: PropTypes.func
};

export default forwardRef(NewTaskButtonAndDialog);
