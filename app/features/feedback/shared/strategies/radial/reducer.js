import _ from 'lodash';

function isAnnotationWithinTolerance(rule, annotation) {
  const annotationX = annotation.x;
  const annotationY = annotation.y;
  const feedbackX = rule.x;
  const feedbackY = rule.y;
  const tolerance = rule.tolerance;

  const distance = Math.sqrt(Math.pow((annotationY - feedbackY), 2) + Math.pow((annotationX - feedbackX), 2));

  return distance < tolerance;
}

// Determines whether there are any annotations falling within tolerance for a
// rule, and appends all successful annotations if so.
function radialReducer(rule, annotations) {
  const result = annotations.filter(annotation =>
    isAnnotationWithinTolerance(rule, annotation));

  return _.assign(rule, {
    success: (result.length > 0),
    successfulClassifications: result
  });
}

export default radialReducer;
