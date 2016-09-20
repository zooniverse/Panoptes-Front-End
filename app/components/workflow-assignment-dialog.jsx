import React from 'react';
import Dialog from 'modal-form/dialog';
import ReactDOM from 'react-dom';

const WorkflowAssignmentDialog = React.createClass({
  statics: {
    start() {
      return Dialog.alert(<WorkflowAssignmentDialog />, {
        className: 'workflow-assignment-dialog',
        closeButton: true,
      });
    },
  },

  handlePromotionDecline() {
    // Hacky way to get the dialog to close.
    // Need to rework Modal Form to allow custom cancel events on child DOM elements
    const closeButton =
      ReactDOM.findDOMNode(this).parentNode.querySelector('.modal-dialog-close-button');
    closeButton.click();
  },

  render() {
    return (
      <div className="content-container">
        <p>
          Congratulations! Because you're doing so well, you can level up and
          access more types of glitches, have more options for classifying them,
          and see glitches that our computer algorithms are even less confident in.
          If you prefer to stay at this level, you can choose to stay.
        </p>
        <div className="workflow-assignment-dialog__buttons">
          <button className="standard-button" type="submit">Try the new workflow</button>
          <button className="minor-button" onClick={this.handlePromotionDecline} type="button">
            No, thanks
          </button>
        </div>
      </div>
    );
  },
});

export default WorkflowAssignmentDialog;
