import _ from 'lodash';
import React from 'react';
import ModalFormDialog from 'modal-form/dialog';
import FeedbackModal from '../components/feedback-modal';
import strategies from '../../shared/strategies';
import getGlobalFeedbackOptionsFromRules from '../../shared/helpers/get-global-feedback-options-from-rules';
// import getPfeMarkerColors from '../../shared/helpers/get-pfe-marker-colors';

function getFeedbackMessagesAndSetMarkerColors(feedback, globalFeedbackOptions) {
  var colorGroupCounters = {
    true: 0,
    false: 0
  };
  const allowedColours = {
    true: globalFeedbackOptions.allowedSuccessFeedbackMarkerColors,
    false: globalFeedbackOptions.allowedFailureFeedbackMarkerColors
  };
  var messageColors = [];

  if (globalFeedbackOptions.pluralSuccessMessagesEnabled || globalFeedbackOptions.pluralFailureMessagesEnabled) {
    let messages = _.chain(feedback).map((item, index) => {
      let message = false;
      if (item.success && item.successEnabled) {
        message = [index, item.pluralSuccessMessage, item.successMessage];
      } else if (!item.success && item.failureEnabled) {
        message = [index, item.pluralFailureMessage, item.failureMessage];
      }
      return message;
    }).compact();

    let uniqueMessages = messages.groupBy(messageData => {
      return [
        messageData[1], messageData[2]
      ];
    });

    let pluralizedMessages = uniqueMessages.map((uniqueMessageGroup) => {
      const groupSuccess = feedback[uniqueMessageGroup[0][0]].success;
      const groupAllowedColors = allowedColours[groupSuccess];
      uniqueMessageGroup.map(messageData => {
        feedback[messageData[0]].color = groupAllowedColors[colorGroupCounters[groupSuccess] % groupAllowedColors.length].label.toLowerCase()
      });
      const groupColor = groupAllowedColors[colorGroupCounters[groupSuccess] % groupAllowedColors.length].label.toLowerCase();
      messageColors.push(groupColor == 'white' ? 'darkgrey' : groupColor);
      colorGroupCounters[groupSuccess]++;
      return uniqueMessageGroup.length > 1
        ? uniqueMessageGroup[0][1].replace('${count}', `${uniqueMessageGroup.length}`)
        : uniqueMessageGroup[0][2];
    });
    return {messages: pluralizedMessages.value(), messageColors: messageColors}
  }
  // fall through
  let messages = _.chain(feedback).map((item) => {
    console.log(allowedColors[colorCounter % allowedColors.length])
    const itemAllowedColors = allowedColours[item.success];
    item.color = itemAllowedColors[colorGroupCounters[item.success] % itemAllowedColors.length].label.toLowerCase();
    messageColors.push(item.color == 'white' ? 'darkgrey' : item.color);
    let message = false;
    if (item.success && item.successEnabled) {
      message = item.successMessage;
    } else if (!item.success && item.failureEnabled) {
      message = item.failureMessage;
    }
    colorGroupCounters[item.success]++;
    return message;
  }).compact();


  return {messages: messages.value(), messageColors: messageColors};

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
  const {messages, messageColors} = getFeedbackMessagesAndSetMarkerColors(feedback, globalFeedbackOptions);
  const props = {
    messages: messages,
    messageColors : messageColors,
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
