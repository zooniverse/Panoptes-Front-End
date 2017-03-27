// TODO: move searching through each subject feedback field here
// once we can limit which to check in the lab UI

// TODO: handle invalid feedback

const singleFeedback = (annotation, subject, workflow, activeFeedbackRules) => {
  const { metadata } = subject;
  const taskFeedback = { question: workflow.tasks[annotation.task].question };

  // -1 represents a null answer for questions where an answer isn't required
  const comparisonValue = (annotation && annotation.value !== null)
    ? annotation.value.toString()
    : '-1';

  taskFeedback.messages = activeFeedbackRules.map(rule => {
    const subjectMessages = (() => {
      const prefixIndex = Object.values(metadata).indexOf(rule.id);
      const prefix = Object.keys(metadata)[prefixIndex].slice(0, -5);
      return {
        success: metadata[`${prefix}_successMessage`] || rule.defaultSuccessMessage,
        failure: metadata[`${prefix}_failureMessage`] || rule.defaultFailureMessage,
      };
    })();
    return (comparisonValue === rule.answerIndex)
      ? subjectMessages.success
      : subjectMessages.failure;
  });
  return taskFeedback;
};

export default singleFeedback;
