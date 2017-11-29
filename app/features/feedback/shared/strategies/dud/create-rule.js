import _ from 'lodash';

function createRule(subjectRule, workflowRule) {
  const rule = {
    failureEnabled: workflowRule.failureEnabled,
    id: subjectRule.id,
    strategy: workflowRule.strategy,
    successEnabled: workflowRule.successEnabled
  };

  if (rule.failureEnabled) {
    rule.failureMessage = subjectRule.failureMessage ||
      workflowRule.defaultFailureMessage;
  }

  if (rule.successEnabled) {
    rule.successMessage = subjectRule.successMessage ||
      workflowRule.defaultSuccessMessage;
  }

  if (_.every(rule, property => property)) {
    return rule;
  } else {
    console.error(`Undefined property in rule ${rule.id}, skipping...`);
    return {};
  }
}

export default createRule;
