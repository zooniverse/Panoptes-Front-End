import PropTypes from 'prop-types';
import React from 'react';
import Dialog from 'modal-form/dialog';
import ReactDOM from 'react-dom';
import { TextSplit } from 'seven-ten';
import Translate from 'react-translate-component';

class WorkflowAssignmentDialog extends React.Component {
  static start(props = {}) {
    return Dialog.alert(<WorkflowAssignmentDialog {...props} />, {
      className: 'workflow-assignment-dialog',
      closeButton: true
    });
  }

  getPromotionMessage = (props) => {
    // The API needs to add the promotion message as a field in project contents...
    const gravitySpy = '1104';
    const snapshotWi = ['5371', '2439'];
    let promotionMessage = <Translate content="classifier.workflowAssignmentDialog.promotionMessage" />;
    const gravitySpyMessage = "Congratulations! Because you're doing so well, you can level up and access more types of glitches, have more options for classifying them, and see glitches that our computer algorithms are even less confident in. If you prefer to stay at this level, you can choose to stay.";
    const snapshotWiMessage = "Congratulations! You’ve unlocked the next level and can now access a new challenge about the environment you see in the trail camera images. If you prefer, you can choose to stay.";

    if (props.project && props.project.id === gravitySpy) {
      promotionMessage = gravitySpyMessage;
    } else if (props.project && snapshotWi.includes(props.project.id)) {
      promotionMessage = snapshotWiMessage;
    }

    return promotionMessage;
  };

  handlePromotionDecline = () => {
    // Hacky way to get the dialog to close.
    // Need to rework Modal Form to allow custom cancel events on child DOM elements
    const closeButton =
      ReactDOM.findDOMNode(this).parentNode.querySelector('.modal-dialog-close-button');
    closeButton.click();
  };

  advanceDefault = () => {
    return this.getPromotionMessage(this.props);
  };

  render() {
    return (
      <div className="content-container">
        <TextSplit
          splitKey="workflow.advance"
          textKey="accept"
          splits={this.props.splits}
          default={this.advanceDefault()}
          elementType="p"
        />

        <div className="workflow-assignment-dialog__buttons">
          <button className="standard-button" type="submit">
            <Translate content="classifier.workflowAssignmentDialog.acceptButton" />
          </button>
          <button className="minor-button" onClick={this.handlePromotionDecline} type="button">
            <TextSplit
              splitKey="workflow.advance"
              textKey="decline"
              splits={this.props.splits}
              default={<Translate content="classifier.workflowAssignmentDialog.declineButton" />}
              elementType="p"
            />
          </button>
        </div>
      </div>
    );
  }
}

WorkflowAssignmentDialog.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.id
  }),
  splits: PropTypes.object
};

export default WorkflowAssignmentDialog;
