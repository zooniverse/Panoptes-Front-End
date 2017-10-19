import React from 'react';
import Dialog from 'modal-form/dialog';

const WorkflowDefaultDialog = ({ onSuccess, onCancel }) => (
    <Dialog tag="div" closeButton={true} onCancel={onCancel}>
      <div>
        You are about to make the default workflow inactive,
        which will remove the default workflow setting from this project.
        The default workflow can be set in the edit workflows page of the project builder.
      </div>
      <br />
      <button
        type="button"
        id="workflowDefaultDialogSuccess"
        onClick={onSuccess}
      >
        ok
      </button>
      <button
        type="button"
        id="workflowDefaultDialogCancel"
        onClick={onCancel}
      >
        cancel
      </button>
    </Dialog>
  );

WorkflowDefaultDialog.defaultProps = {
  onCancel: () => {},
  onSuccess: () => {}
};

WorkflowDefaultDialog.propTypes = {
  onCancel: React.PropTypes.func,
  onSuccess: React.PropTypes.func
};

export default WorkflowDefaultDialog;
