import React from 'react';
import Dialog from 'modal-form/dialog';
import ReactDOM from 'react-dom';
import {TextSplit} from 'seven-ten';

const WorkflowAssignmentDialog = React.createClass({
  statics: {
    start(props={}) {
      return Dialog.alert(<WorkflowAssignmentDialog {...props} />, {
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

  advanceDefault() {
    return(`
        Congratulations! Because you're doing so well, you can level up and
        access more types of glitches, have more options for classifying them,
        and see glitches that our computer algorithms are even less confident in.
        If you prefer to stay at this level, you can choose to stay.
    `);
  },

  render() {
    return (
      <div className="content-container">
        <TextSplit splitKey="workflow.advance"
          textKey="accept"
          splits={this.props.splits}
          default={this.advanceDefault()}
          elementType={"p"} />

        <div className="workflow-assignment-dialog__buttons">
          <button className="standard-button" type="submit">Try the new workflow</button>
          <button className="minor-button" onClick={this.handlePromotionDecline} type="button">
            <TextSplit splitKey="workflow.advance"
              textKey="decline"
              splits={this.props.splits}
              default={"No, thanks"}
              elementType={"p"}/>
          </button>
        </div>
      </div>
    );
  },
});

WorkflowAssignmentDialog.propTypes = {
  splits: React.PropTypes.object
};

export default WorkflowAssignmentDialog;
