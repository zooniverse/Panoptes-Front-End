function isAnnotationWithinEllipse(rule, annotation) {
  const annotationX = annotation.x;
  const annotationY = annotation.y;
  const feedbackX = rule.x;
  const feedbackY = rule.y;
  const feedbackA = rule.tolerance_a;
  const feedbackB = rule.tolerance_b;

  const feedbackThetaRad = Math.PI * (rule.theta / 180.0)
  const projectedX = (annotationX - feedbackX) * Math.cos(feedbackThetaRad) + (annotationY - feedbackY) * Math.sin(feedbackThetaRad)
  const projectedY = (annotationY - feedbackY) * Math.cos(feedbackThetaRad) - (annotationX - feedbackX) * Math.sin(feedbackThetaRad)

  // Math.pow is a restricted property, but using the exponential operator (**)
  // breaks the build :(
  /* eslint-disable no-restricted-properties */
  const condition = Math.pow((2.0 * projectedX / feedbackA), 2) + Math.pow((2.0 * projectedY / feedbackB), 2);
  /* eslint-enable no-restricted-properties */

  return condition < 1.0;
}

// Determines whether there are any annotations falling within tolerance for a
// rule, and appends all successful annotations if so.
function pointInEllipseReducer(rule, annotations = []) {
  const result = annotations.filter(annotation => isAnnotationWithinEllipse(rule, annotation));

  return Object.assign(rule, {
    success: (result.length > 0),
    successfulClassifications: result
  });
}

export default pointInEllipseReducer;
