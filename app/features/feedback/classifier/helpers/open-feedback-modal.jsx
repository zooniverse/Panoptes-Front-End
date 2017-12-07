import _ from 'lodash';
import React from 'react';
import ModalFormDialog from 'modal-form/dialog';
import FeedbackModal from '../components/feedback-modal';

function getFeedbackMessages(feedback) {
  return _.chain(feedback)
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

function openFeedbackModal(feedback) {
  const messages = getFeedbackMessages(feedback);

  if (messages.length > 0) {
    const modal = (<FeedbackModal messages={messages} />);
    return ModalFormDialog.alert(modal, {
      required: true
    });
  } else {
    return Promise.resolve(true);
  }
}

export default openFeedbackModal;
