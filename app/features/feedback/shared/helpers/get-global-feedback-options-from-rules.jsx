import _ from 'lodash';

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
  return {pluralSuccessMessagesEnabled: pluralSuccessMessagesEnabled, pluralFailureMessagesEnabled: pluralFailureMessagesEnabled, colorizeUniqueMessagesEnabled: colorizeUniqueMessagesEnabled, successFailureShapesEnabled: successFailureShapesEnabled}
}

export default getGlobalFeedbackOptionsFromRules;
