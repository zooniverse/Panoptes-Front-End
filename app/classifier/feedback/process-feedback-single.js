import FeedbackRuleSet from './feedback-ruleset';

const processSingleFeedback = ({ annotation, subject, task }) => {
  const feedbackRuleSet = new FeedbackRuleSet(subject, task);
  const comparisonValue = (annotation && annotation.value !== null) ? annotation.value.toString() : '-1';

  return {
    task: annotation.task,
    type: 'single',
    feedback: feedbackRuleSet.rules.reduce((checkedRules, rule) => {
      const result = comparisonValue === rule.answerIndex;
      checkedRules.push({
        question: task.question,
        success: result,
        message: (result) ? rule.successMessage : rule.failureMessage
      });
      return checkedRules;
    }, [])
  };
};

export default processSingleFeedback;
