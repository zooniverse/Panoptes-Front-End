import React from 'react';
import Translate from 'react-translate-component';

const WorkflowDefaultDialog = ({ onSuccess }) => {

  return (
    <div>
      <Translate content="workflowDefaultDialog.text" />
      <br />
      <button type="submit" onSubmit={onSuccess}>ok</button>
    </div>
  )
}

export default WorkflowDefaultDialog;
