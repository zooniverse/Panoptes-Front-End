import FeedbackRuleSet from './feedback-ruleset';

const isWithinTolerance = (annotationX, annotationY, feedbackX, feedbackY, tolerance) => {
  const distance = Math.sqrt(Math.pow((annotationY - feedbackY), 2) + Math.pow((annotationX - feedbackX), 2));
  return distance < tolerance;
};

const processDrawingFeedback = ({ annotation, subject, task }) => {
  const feedbackRuleSet = new FeedbackRuleSet(subject, task);
  return feedbackRuleSet.rules.reduce((checkedRules, rule) => {
    const result = annotation.value.reduce((found, point) => {
      if (isWithinTolerance(point.x, point.y, parseInt(rule.x, 10), parseInt(rule.y, 10), parseInt(rule.tol, 10))) {
        found = true;
      }
      return found;
    }, false);

    checkedRules.push({
      task: annotation.task,
      type: 'drawing',
      x: rule.x,
      y: rule.y,
      tol: rule.tol,
      success: result,
      message: (result) ? rule.successMessage : rule.failureMessage,
      target: 'classifier'
    });
    return checkedRules;
  }, []);
};

export default processDrawingFeedback;
