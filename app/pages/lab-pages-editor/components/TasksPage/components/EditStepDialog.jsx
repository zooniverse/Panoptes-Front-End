import { forwardRef, useRef, useImperativeHandle } from 'react';

function EditStepDialog({
  step
}, forwardedRef) {
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

  // if (!step) return null;

  return (
    <dialog
      /* aria-labelledby="dialog-title"*/
      ref={editStepDialog}
      /* open="true"  // MDN recommends not using this attribute. But if we have to, use "true", not {true} */
    >
      <form className="dialog-body edit-step">
        Edit Step Dialog
      </form>
    </dialog>
  );
}

export default forwardRef(EditStepDialog);
