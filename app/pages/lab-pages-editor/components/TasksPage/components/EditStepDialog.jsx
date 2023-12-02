import { forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '../../../icons/CloseIcon.jsx';

function EditStepDialog({
  allTasks = {},
  step = [],
  stepIndex = -1
}, forwardedRef) {
  const [ stepKey, stepBody ] = step ;
  const editStepDialog = useRef(null);

  // the dialog is opened via the parent TasksPage.
  function openDialog() {
    editStepDialog.current?.showModal();
  }

  function closeDialog() {
    editStepDialog.current?.close();
  }

  useImperativeHandle(forwardedRef, () => {
    return {
      openDialog
    };
  });

  const title = 'Create a (???) Task'

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
      <form className="dialog-body">
        Edit step
      </form>
    </dialog>
  );
}

EditStepDialog.propTypes = {
  allTasks: PropTypes.object,
  step: PropTypes.object,
  stepIndex: PropTypes.number
};

export default forwardRef(EditStepDialog);
