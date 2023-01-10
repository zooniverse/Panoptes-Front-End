import _ from 'lodash';
import React from 'react';
import ModalFormDialog from 'modal-form/dialog';
import Translate from 'react-translate-component';
import FeedbackModal from '../components/feedback-modal';
import strategies from '../../shared/strategies';
import categories from './feedback-categories';

export function getFeedbackMessages(feedback) {
  const messages = _.chain(feedback)
    .map((item) => {
      let message = false;
      let category = null;
      if (item.success && item.successEnabled) {
        message = item.successMessage;
        category = item.falsePosMode ? categories.FALSEPOS : categories.CORRECT;
      } else if (!item.success && !item.falsePosMode && item.failureEnabled) {
        message = item.failureMessage;
        category = categories.INCORRECT;
      }
      return message ? [message, category] : message;
    })
    .compact();

  const catGroupedReducedMessages = messages.groupBy(message => message[1]).map((catGroup, cat) => {
    const reducedMessages = _.chain(catGroup).groupBy(message => message[0]).map((groupData, key) => `${key} (${groupData.length} ${groupData.length > 1 ? 'matches' : 'match'})`).value();
    return {
      category: cat,
      messages: reducedMessages
    };
  }).keyBy('category')
    .mapValues('messages')
    .value();

  return catGroupedReducedMessages;
}

function getFeedbackMarks(feedback) {
  // This is slightly weird, but Coffeescript does not seem to enjoy trying
  // to render an array of components, so we check here to see if we need to
  // render anything, and then pass back the items to be rendered. We then
  // basically repeat this process in the MarkingsRenderer component.
  return _.chain(feedback)
    .map((item) => {
      const { FeedbackMark } = strategies[item.strategy];
      return (FeedbackMark) ? item : false;
    })
    .compact()
    .value();
}

// The subject viewer will be hidden if `hideSubjectViewer` is enabled on
// _any_ feedback rule.
function getHideSubjectViewer(feedback) {
  return feedback.reduce((result, item) => (result || item.hideSubjectViewer) || false, false);
}

function getSubjectViewerProps(feedback, subjectViewerProps, taskId) {
  const feedbackMarks = getFeedbackMarks(feedback);
  const hideSubjectViewer = getHideSubjectViewer(feedback);

  if (hideSubjectViewer || !feedbackMarks.length) {
    return false;
  }

  const props = _.cloneDeep(subjectViewerProps);
  const { annotations } = props;
  const targetAnnotation = _.find(annotations, ['task', taskId]);
  targetAnnotation.feedback = feedbackMarks;
  return props;
}

function openFeedbackModal({ feedback, subjectViewerProps, taskId }) {
  const props = {
    messages: getFeedbackMessages(feedback),
    subjectViewerProps: getSubjectViewerProps(feedback, subjectViewerProps, taskId)
  };

  if (Object.keys(props.messages).length > 0) {
    const modal = (<FeedbackModal {...props} />);
    return ModalFormDialog.alert(modal, {
      required: true
    });
  } else {
    return Promise.resolve(true);
  }
}

export default openFeedbackModal;
