import FeedbackRuleSet from './feedback-ruleset';

const isWithinTolerance = (annotationX, annotationY, feedbackX, feedbackY, tolerance) => {
  const distance = Math.sqrt(Math.pow((annotationY - feedbackY), 2) + Math.pow((annotationX - feedbackX), 2));
  return distance < tolerance;
};

const createFeedbackItem = (success, annotation, rule) => {
  const feedbackItem = {
    task: annotation.task,
    type: 'drawing',
    success,
    message: (success) ? rule.successMessage : rule.failureMessage
  };

  if (rule.dud) {
    feedbackItem.target = 'summary';
  } else {
    feedbackItem.x = rule.x;
    feedbackItem.y = rule.y;
    feedbackItem.tol = rule.tol;
    feedbackItem.target = 'classifier';
  }

  return feedbackItem;
};

const processNormalRule = (annotation, rule) => {
  const result = annotation.value.reduce((found, point) => {
    if (isWithinTolerance(point.x, point.y, parseInt(rule.x, 10), parseInt(rule.y, 10), parseInt(rule.tol, 10))) {
      found = true;
    }
    return found;
  }, false);

  return createFeedbackItem(result, annotation, rule);
};

const processDudRule = (annotation, rule) => {
  const result = (!annotation.value || annotation.value.length === 0);
  return createFeedbackItem(result, annotation, rule);
};

const processDrawingFeedback = (annotation, subject, task) => {
  const feedbackRuleSet = new FeedbackRuleSet(subject, task);
  return feedbackRuleSet.rules.reduce((checkedRules, rule) => {
    const ruleFunction = (rule.dud) ? processDudRule : processNormalRule;
    const ruleResult = ruleFunction(annotation, rule);
    if ((ruleResult.success && rule.successEnabled) || (!ruleResult.success && rule.failureEnabled)) {
      checkedRules.push(ruleResult);
    }
    return checkedRules;
  }, []);
};

export default processDrawingFeedback;
