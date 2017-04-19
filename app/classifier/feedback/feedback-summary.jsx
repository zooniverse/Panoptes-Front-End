import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import single from './single-feedback';

counterpart.registerTranslations('en', {
  feedbackSummary: {
    title: 'Feedback on your classification',
  }
});


class FeedbackSummary extends React.Component {
  constructor(props) {
    super(props);
    this.constructFeedbackArray = this.constructFeedbackArray.bind(this);
    this.getActiveFeedbackRules = this.getActiveFeedbackRules.bind(this);
    this.renderFeedbackSummary = this.renderFeedbackSummary.bind(this);
  }

  render() {
    const activeFeedbackRules = this.getActiveFeedbackRules();
    return (Object.keys(activeFeedbackRules).length)
      ? this.renderFeedbackSummary(activeFeedbackRules)
      : null;
  }

  constructFeedbackArray(activeFeedbackRules) {
    const { classification, subject, workflow } = this.props;

    return classification.annotations.reduce((allFeedback, annotation) => {
      const task = workflow.tasks[annotation.task];
      switch (task.type) {
        case 'single':
          allFeedback.push(single(annotation, subject, workflow, activeFeedbackRules[annotation.task]));
          break;
      }
      return allFeedback;
    }, []);
  }

  getActiveFeedbackRules() {
    const { classification, subject, workflow } = this.props;
    const { metadata } = subject;

    // Get a list of feedback types set on the current subject
    const subjectFeedbackTypes = Object.keys(metadata)
      .map(key => (RegExp(/#feedback_(\d*?)_type/).test(key)) ? key : false)
      .filter(key => metadata[key] !== '')
      .filter(key => key)
      .map(field => metadata[field]);

    if (!subjectFeedbackTypes.length) {
      return false;
    } else {

      // Check each annotation against the subject and workflow to get a list of
      // feedback tasks to run against that annotation.
      return classification.annotations.reduce((rules, { task }) => {
        const workflowTask = workflow.tasks[task];
        if (workflowTask.feedback.enabled) {
          const applicableRules = workflowTask.feedback.types.filter(feedbackType =>
            feedbackType.valid && subjectFeedbackTypes.includes(feedbackType.id));
          if (applicableRules.length > 0) {
            rules[task] = applicableRules;
          }
        }
        return rules;
      }, {});
    }
  }

  renderFeedbackSummary(activeFeedbackRules) {
    const feedbackArray = this.constructFeedbackArray(activeFeedbackRules);

    return (
      <section>
        <strong>
          <Translate content="feedbackSummary.title" />
        </strong>
        <div className="classification-task-summary-with-feedback">
          <ol>
            {feedbackArray.map(taskFeedback => (
              <li key={taskFeedback.question}>
                <p>{taskFeedback.question}</p>
                <ol>
                  {taskFeedback.messages.map(message => (
                    <li key={message}>{message}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

}

export default FeedbackSummary;
