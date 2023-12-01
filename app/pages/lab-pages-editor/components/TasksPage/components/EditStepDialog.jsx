import { forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

function EditStepDialog({
  step = [],
  stepIndex = -1
}, forwardedRef) {
  const [ stepKey, stepBody ] = step ;
  const editStepDialog = useRef(null);

  function openDialog() {
    console.log('+++ editStepDialog', editStepDialog)
    editStepDialog.current?.showModal();
  }

  function closeDialog() {
    editStepDialog.current?.close();
  }

  useImperativeHandle(forwardedRef, () => {
    return {
      closeDialog,
      openDialog
    };
  });


  return (
    <dialog
      /* aria-labelledby="dialog-title"*/
      ref={editStepDialog}
      /* open="true"  // MDN recommends not using this attribute. But if we have to, use "true", not {true} */
    >
      <form className="dialog-body edit-step">
        Edit Step Dialog: {stepKey}
      </form>
    </dialog>
  );
}

EditStepDialog.propTypes = {
  step: PropTypes.object,
  stepIndex: PropTypes.number
};

export default forwardRef(EditStepDialog);
