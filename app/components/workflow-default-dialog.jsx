import React from 'react';
import Translate from 'react-translate-component';

const WorkflowDefaultDialog = ({ onSuccess }) => (
  <div>
    <Translate content="workflowDefaultDialog.text" />
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
