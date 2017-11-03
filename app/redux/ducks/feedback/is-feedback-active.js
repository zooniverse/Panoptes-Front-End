import FeedbackRuleSet from './feedback-ruleset';

function isFeedbackEnabledOnProject(project) {
  return project &&
    project.experimental_tools &&
    project.experimental_tools.includes('general feedback');
}

function isFeedbackEnabledOnSubject(subject, workflow) {
  return Object.keys(workflow.tasks).reduce((result, taskKey) => {
    let newResult = result;
    if (!newResult) {
      const ruleset = new FeedbackRuleSet(subject, workflow.tasks[taskKey]);
      if (ruleset.rules.length) {
        newResult = true;
      }
    }
    return newResult;
  }, false);
}

function isFeedbackActive(project, subject, workflow) {
  return isFeedbackEnabledOnProject(project) &&
    isFeedbackEnabledOnSubject(subject, workflow);
}

export default isFeedbackActive;
