import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as feedbackActions from '../../redux/ducks/feedback';
import single from './single-feedback';
import DrawingFeedback from './drawing-feedback';

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

  componentWillUnmount() {
    this.props.actions.feedback.clearFeedback();
  }

  constructFeedbackArray(activeFeedbackRules) {
    const { classification, subject, workflow } = this.props;

    return classification.annotations.reduce((allFeedback, annotation) => {
      const task = workflow.tasks[annotation.task];
      switch (task.type) {
        case 'single':
          allFeedback.push(single(annotation, subject, workflow, activeFeedbackRules[annotation.task]));
          break;
        case 'drawing':
          allFeedback.push(<DrawingFeedback
            annotation={annotation}
            subject={subject}
            workflow={workflow}
            task={task}
          />);
          break;
      }
      return allFeedback;
    }, []);
  }

  getActiveFeedbackRules() {
    const { classification, subject, workflow } = this.props;
    const { metadata } = subject;

    // Get a list of feedback types set on the current subject
    const subjectFeedbackTypes = Object.keys(metadata).reduce((types, key) => {
      if (RegExp(/#feedback_(\d*?)_type/).test(key) && metadata[key] && metadata[key] !== '') {
        types.push(metadata[key]);
      }
      return types;
    }, []);

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
    console.info('feedbackArray', feedbackArray);
    return (
      <section>
        <strong>
          <Translate content="feedbackSummary.title" />
        </strong>
        <div className="classification-task-summary-with-feedback">
          insert content
          {feedbackArray}
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: {
    feedback: bindActionCreators(feedbackActions, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(FeedbackSummary);
