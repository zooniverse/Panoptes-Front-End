import ruleChecker from '../../../helpers/rule-checker';

function createRule(subjectRule, workflowRule) {
  const rule = {
    failureEnabled: workflowRule.failureEnabled || false,
    hideSubjectViewer: workflowRule.hideSubjectViewer || false,
    id: subjectRule.id,
    strategy: workflowRule.strategy,
    successEnabled: workflowRule.successEnabled || false,
    x: subjectRule.x,
    y: subjectRule.y,
    a: subjectRule.tolerance_a || workflowRule.defaultTolerance,
    b: subjectRule.tolerance_b || workflowRule.defaultTolerance,
    theta: subjectRule.theta || 0
  };

  if (rule.failureEnabled) {
    rule.failureMessage = subjectRule.failureMessage ||
      workflowRule.defaultFailureMessage;
  }

  if (rule.successEnabled) {
    rule.successMessage = subjectRule.successMessage ||
      workflowRule.defaultSuccessMessage;
  }

  return ruleChecker(rule);
}

export default createRule;
