/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unknown-property */

import { useRef } from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '../../../icons/CloseIcon.jsx';
import TaskIcon from '../../../icons/TaskIcon.jsx';
// import strings from '../../../strings.json'; // TODO: move all text into strings

function NewTaskButtonAndDialog({
  addTaskWithStep = () => {}
}) {
  const newTaskDialog = useRef(null);

  function openNewTaskDialog() {
    newTaskDialog.current?.showModal();
  }

  function closeNewTaskDialog() {
    newTaskDialog.current?.close();
  }

  function addNewTask(e) {
    const tasktype = e?.currentTarget?.dataset?.tasktype;
    // Protip: don't use event.target, since it might return the child of the button, instead of the button itself

    closeNewTaskDialog();
    addTaskWithStep(tasktype);
  }

  return (
    <>
      <button
        className="flex-item big primary decoration-plus"
        onClick={openNewTaskDialog}
        type="button"
      >
        Add a new Task
      </button>
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
            onClick={closeNewTaskDialog}
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
    </>
  );
}

NewTaskButtonAndDialog.propTypes = {
  addTaskWithStep: PropTypes.func
};

export default NewTaskButtonAndDialog;
