import FeedbackRuleSet from './feedback-ruleset';

const isThereFeedback = (subject, workflow) => {
  let result = false;
  for (const task in workflow.tasks) {
    if (Object.prototype.hasOwnProperty.call(workflow.tasks, task)) {
      const ruleset = new FeedbackRuleSet(subject, workflow.tasks[task]);
      if (ruleset.rules.length) {
        result = true;
        break;
      }
    }
  }
  return result;
};

export { isThereFeedback };
