import FeedbackRuleSet from './feedback-ruleset';

const processSingleFeedback = (annotation, subject, task) => {
  const feedbackRuleSet = new FeedbackRuleSet(subject, task);
  const comparisonValue = (annotation && annotation.value !== null) ? annotation.value.toString() : '-1';
  return feedbackRuleSet.rules.reduce((checkedRules, rule) => {
    const result = comparisonValue === rule.answerIndex;

    if ((result && rule.successEnabled) || (!result && rule.failureEnabled)) {
      checkedRules.push({
        task: annotation.task,
        type: 'single',
        question: task.question,
        success: result,
        message: (result) ? rule.successMessage : rule.failureMessage,
        target: 'summary'
      });
    }

    return checkedRules;
  }, []);
};

export default processSingleFeedback;
