import React, { Component } from 'react';
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
    console.log('container', this.props)
    return (
      <FeedbackModal feedback={this.getFeedbackMessages()} />
    );
  }
}

export default FeedbackModalContainer;
