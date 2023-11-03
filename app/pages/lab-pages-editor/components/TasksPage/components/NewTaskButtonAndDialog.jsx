/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/forbid-prop-types */

import { useRef } from 'react';

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
        className="new-task-dialog"
        ref={newTaskDialog}
        /* open="true"  // MDN recommends not using this attribute. But if we have to, use "true", not {true} */
      >
        <div>Add New Task</div>
        <button type="button" onClick={closeNewTaskDialog}>Close</button>
        <form>
        </form>
      </dialog>
    </>
  );
}

NewTaskButtonAndDialog.propTypes = {};

export default NewTaskButtonAndDialog;
