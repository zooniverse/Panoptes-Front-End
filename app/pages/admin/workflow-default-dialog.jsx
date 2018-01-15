import PropTypes from 'prop-types';
import React from 'react';
import Dialog from 'modal-form/dialog';

const WorkflowDefaultDialog = ({ onSuccess, onCancel }) => (
    <Dialog tag="div" closeButton={true} onCancel={onCancel}>
      <p>
        You are about to make the default workflow inactive,
        which will remove the default workflow setting from this project.
        The default workflow can be set in the edit workflows page of the project builder.
      </p>
      <button
        type="button"
        onClick={onSuccess}
      >
        ok
      </button>
      <button
        type="button"
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
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func
};

export default WorkflowDefaultDialog;