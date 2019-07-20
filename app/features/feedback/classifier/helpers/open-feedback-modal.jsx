import _ from 'lodash';
import React from 'react';
import ModalFormDialog from 'modal-form/dialog';
import FeedbackModal from '../components/feedback-modal';
import strategies from '../../shared/strategies';
import getGlobalFeedbackOptionsFromRules from '../../shared/helpers/get-global-feedback-options-from-rules';

function getFeedbackMessages(feedback, globalFeedbackOptions) {
  if (globalFeedbackOptions.pluralSuccessMessagesEnabled || globalFeedbackOptions.pluralFailureMessagesEnabled) {
    let messages = _.chain(feedback).map((item) => {
      let message = false;
      if (item.success && item.successEnabled) {
        message = [item.pluralSuccessMessage, item.successMessage];
      } else if (!item.success && item.failureEnabled) {
        message = [item.pluralFailureMessage, item.failureMessage];
      }
      return message;
    }).compact();

    let uniqueMessages = messages.groupBy();
    console.log(uniqueMessages.value());

    let pluralizedMessages = uniqueMessages.map((uniqueMessageGroup, uniqueGroupKey) => {
      return uniqueMessageGroup.length > 1
        ? uniqueMessageGroup[0][0].replace('${count}', `${uniqueMessageGroup.length}`)
        : uniqueMessageGroup[0][1];
    });
    return pluralizedMessages.value();
  }
  // fall through
  let messages = _.chain(feedback).map((item) => {
    let message = false;
    if (item.success && item.successEnabled) {
      message = item.successMessage;
    } else if (!item.success && item.failureEnabled) {
      message = item.failureMessage;
    }
    return message;
  }).compact();

  return messages.value()

}

function getFeedbackMarks(feedback) {
  // This is slightly weird, but Coffeescript does not seem to enjoy trying
  // to render an array of components, so we check here to see if we need to
  // render anything, and then pass back the items to be rendered. We then
  // basically repeat this process in the MarkingsRenderer component.
  const marks = _.chain(feedback).map((item) => {
    const {FeedbackMark} = strategies[item.strategy];
    return (FeedbackMark)
      ? item
      : false;
  }).compact().value();
  console.log(marks);
  return marks;

}

// The subject viewer will be hidden if `hideSubjectViewer` is enabled on
// _any_ feedback rule.
function getHideSubjectViewer(feedback) {
  return feedback.reduce((result, item) => (result || item.hideSubjectViewer) || false, false);
}

function getSubjectViewerProps(feedback, globalFeedbackOptions, subjectViewerProps, taskId) {
  const feedbackMarks = getFeedbackMarks(feedback);
  const hideSubjectViewer = getHideSubjectViewer(feedback);

  if (hideSubjectViewer || !feedbackMarks.length) {
    return false;
  }

  const props = _.cloneDeep(subjectViewerProps);
  const {annotations} = props;
  const targetAnnotation = _.find(annotations, ['task', taskId]);
  targetAnnotation.feedback = feedbackMarks;
  return props;
}

function openFeedbackModal({feedback, subjectViewerProps, taskId}) {
  const globalFeedbackOptions = getGlobalFeedbackOptionsFromRules(feedback);
  const props = {
    messages: getFeedbackMessages(feedback, globalFeedbackOptions),
    globalFeedbackOptions: globalFeedbackOptions,
    subjectViewerProps: getSubjectViewerProps(feedback, globalFeedbackOptions, subjectViewerProps, taskId)
  };

  if (props.messages.length > 0) {
    const modal = (<FeedbackModal {...props}/>);
    return ModalFormDialog.alert(modal, {required: true});
  } else {
    return Promise.resolve(true);
  }
}

export default openFeedbackModal;
