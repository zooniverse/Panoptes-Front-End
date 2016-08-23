import React from 'react';
import Dialog from 'modal-form/dialog';

const WorkflowAssignmentDialog = React.createClass({
  statics: {
    start(history, location, preferences) {
      return Dialog.alert(<WorkflowAssignmentDialog />, {
        className: 'workflow-assignment-dialog',
        closeButton: true,
        onSubmit: this.handleNewWorkflowAssignment.bind(null, history, location, preferences),
      });
    },

    handleNewWorkflowAssignment(history, location, preferences) {
      history.push({
        pathname: location.pathname,
        query: { workflow: preferences.settings.workflow_id },
      });
    },
  },

  render() {
    return (
      <div className="content-container">
        <p>
          Congratulations! Because you're doing so well, you can level up and
          access more types of glitches, have more options for classifying them,
          and see glitches that our computer algorithms are even less confident in.
          If you prefer to stay at this level, you can choose to stay. You can switch
          back to a previous workflow from the project home page.
        </p>
        <button type="submit">Try the new workflow</button>
      </div>
    );
  },
});

export default WorkflowAssignmentDialog;
