import React from 'react';

const WorkflowDefaultDialog = ({ onSuccess }) => {

  return (
    <div>
      <div>
        You are about to make the default workflow inactive,
        which will remove the 'default' setting from this workflow.
        Go to project builder => workflows to set a default workflow.
      </div>
      <button type="submit" onSubmit={onSuccess}>ok</button>
    </div>
  )
}

export default WorkflowDefaultDialog;
