import _ from 'lodash';
import getPfeMarkerColors from '../../shared/helpers/get-pfe-marker-colors';


function getGlobalFeedbackOptionsFromRules(rules) {
  // could include HideSubjectViewer here
  const pluralSuccessMessagesEnabled = _.chain(rules).some(rule => {
    return rule.pluralSuccessMessagesEnabled;
  }).value();
  const pluralFailureMessagesEnabled = _.chain(rules).some(rule => {
    return rule.pluralFailureMessagesEnabled;
  }).value();
  const colorizeUniqueMessagesEnabled = _.chain(rules).some(rule => {
    return rule.colorizeUniqueMessagesEnabled;
  }).value();
  const successFailureShapesEnabled = _.chain(rules).some(rule => {
    return rule.successFailureShapesEnabled;
  }).value();
  const allowedSuccessFeedbackMarkerColors = _.chain(rules).some().value() ? rules[0].allowedSuccessFeedbackMarkerColors : getPfeMarkerColors();
  const allowedFailureFeedbackMarkerColors = _.chain(rules).some().value() ? rules[0].allowedFailureFeedbackMarkerColors : getPfeMarkerColors();
  return {pluralSuccessMessagesEnabled: pluralSuccessMessagesEnabled, pluralFailureMessagesEnabled: pluralFailureMessagesEnabled, colorizeUniqueMessagesEnabled: colorizeUniqueMessagesEnabled, successFailureShapesEnabled: successFailureShapesEnabled, allowedSuccessFeedbackMarkerColors: allowedSuccessFeedbackMarkerColors, allowedFailureFeedbackMarkerColors: allowedFailureFeedbackMarkerColors};
}

export default getGlobalFeedbackOptionsFromRules;
