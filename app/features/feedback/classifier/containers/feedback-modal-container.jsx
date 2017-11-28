import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import FeedbackModal from '../components/feedback-modal';

class FeedbackModalContainer extends Component {
  constructor(props) {
    super(props);
    this.getFeedbackMessages = this.getFeedbackMessages.bind(this);
  }

  getFeedbackMessages() {
    return _.chain(this.props.feedback)
      .map((item) => {
        let message = false;
        if (item.success && item.successEnabled) {
          message = item.successMessage;
        } else if (!item.success && item.failureEnabled) {
          message = item.failureMessage;
        }
        return message;
      })
      .compact()
      .value();
  }

  render() {
    const messages = this.getFeedbackMessages();
    return (
      <FeedbackModal messages={messages} />
    );
  }
}

FeedbackModalContainer.propTypes = {
  feedback: PropTypes.arrayOf(PropTypes.shape({
    success: PropTypes.bool,
    successEnabled: PropTypes.string,
    successMessage: PropTypes.string,
    failureEnabled: PropTypes.string,
    failureMessage: PropTypes.string
  }))
};

export default FeedbackModalContainer;
