import ruleChecker from '../../../helpers/rule-checker';
import getPfeMarkerColors from '../../../../shared/helpers/get-pfe-marker-colors';

function createRule(subjectRule, workflowRule) {
  const rule = {
    failureEnabled: workflowRule.failureEnabled || false,
    hideSubjectViewer: workflowRule.hideSubjectViewer || false,
    id: subjectRule.id,
    strategy: workflowRule.strategy,
    successEnabled: workflowRule.successEnabled || false,
    tolerance: subjectRule.tolerance || workflowRule.defaultTolerance,
    x: subjectRule.x,
    y: subjectRule.y,
    // Not ideal having these data for all rules
    pluralSuccessMessagesEnabled: workflowRule.pluralSuccessMessagesEnabled,
    pluralFailureMessagesEnabled: workflowRule.pluralFailureMessagesEnabled,
    colorizeUniqueMessagesEnabled: workflowRule.colorizeUniqueMessagesEnabled,
    successFailureShapesEnabled: workflowRule.successFailureShapesEnabled,
    allowedSuccessFeedbackMarkerColors: workflowRule.allowedSuccessFeedbackMarkerColors || false,
    allowedFailureFeedbackMarkerColors: workflowRule.allowedFailureFeedbackMarkerColors || false,
    // allow hard override using metadata - respected in open-feedback-modal
    color : subjectRule.color || false
  };

  if (rule.failureEnabled) {
    rule.failureMessage = subjectRule.failureMessage ||
      workflowRule.defaultFailureMessage;
    if (rule.pluralFailureMessagesEnabled) {
      rule.pluralFailureMessage = subjectRule.pluralFailureMessage ||
        workflowRule.defaultPluralFailureMessage;
    }
  }

  if (rule.successEnabled) {
    rule.successMessage = subjectRule.successMessage ||
      workflowRule.defaultSuccessMessage;
    if (rule.pluralSuccessMessagesEnabled) {
      rule.pluralSuccessMessage = subjectRule.pluralSuccessMessage ||
        workflowRule.defaultPluralSuccessMessage;
    }
  }

  return ruleChecker(rule);
}

export default createRule;
