/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unknown-property */

import { useRef } from 'react';

import CloseIcon from '../../../icons/CloseIcon.jsx';
// import strings from '../../../strings.json'; // TODO: move all text into strings

function NewTaskButtonAndDialog() {
  const newTaskDialog = useRef(null);

  function openNewTaskDialog() {
    newTaskDialog.current?.showModal();
  }

  function closeNewTaskDialog() {
    newTaskDialog.current?.close();
  }

  /*
  WARNING: the <dialog> element should automatically close with the Esc key,
  but this seems disabled. This doesn't seem to be a problem with React, but
  with PFE.
   */
  // function dialogOnKeyUp(e) {
  //  if (e.key === 'Escape') newTaskDialog.current?.close();
  // }

  return (
    <>
      <button
        className="flex-item big primary"
        onClick={openNewTaskDialog}
        type="button"
      >
        Add a new Task +
      </button>
      <dialog
        autofocus="true"
        aria-labelledby="dialog-title"
        ref={newTaskDialog}
        /* open="true"  // MDN recommends not using this attribute. But if we have to, use "true", not {true} */
      >
        <div className="dialog-header flex-row">
          <h4 id="dialog-title" className="flex-item">
            Choose a Task type
          </h4>
          <button
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
          <div>
            <button type="button" className="new-task-button">
              <span
                aria-label="Task type: text"
                className="fa fa fa-file-text-o fa-fw"
                role="img"
              />
              <span>Text</span>
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

NewTaskButtonAndDialog.propTypes = {};

export default NewTaskButtonAndDialog;
