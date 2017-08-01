import FeedbackRuleSet from './feedback-ruleset';

const isFeedbackActive = project => project &&
  project.experimental_tools &&
  project.experimental_tools.includes('general feedback');

const isThereFeedback = (subject, workflow) =>
  Object.keys(workflow.tasks).reduce((result, taskKey) => {
    let newResult = result;
    if (!newResult) {
      const ruleset = new FeedbackRuleSet(subject, workflow.tasks[taskKey]);
      if (ruleset.rules.length) {
        newResult = true;
      }
    }
    return newResult;
  }, false);

export { isFeedbackActive, isThereFeedback };
