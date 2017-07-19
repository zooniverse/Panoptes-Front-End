import FeedbackRuleSet from './feedback-ruleset';

const isFeedbackActive = project => project &&
  project.experimental_tools &&
  project.experimental_tools.includes('general feedback');

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

export { isFeedbackActive, isThereFeedback };
