function EditStepDialog() {

  return (
    <dialog
      aria-labelledby="dialog-title"
      ref={editTasksDialog}
      /* open="true"  // MDN recommends not using this attribute. But if we have to, use "true", not {true} */
    >
      <form className="dialog-body edit-step">
      </form>
    </dialog>
  );
}

export default EditStepDialog;
