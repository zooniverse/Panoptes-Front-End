import React from 'react';

const WorkflowDefaultDialog = ({ onSuccess }) => (
  <div>
    <div>
      You are about to make the default workflow inactive,
      which will remove the default setting from this workflow.
      The default workflow can be set in the workflows page of the project builder.
    </div>
    <br />
    <button type="submit" onSubmit={onSuccess}>ok</button>
  </div>
  );

WorkflowDefaultDialog.defaultProps = {
  onSuccess: () => {}
};

WorkflowDefaultDialog.propTypes = {
  onSuccess: React.PropTypes.func
};

export default WorkflowDefaultDialog;
