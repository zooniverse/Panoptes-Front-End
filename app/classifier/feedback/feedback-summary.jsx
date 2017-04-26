import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as feedbackActions from '../../redux/ducks/feedback';
import SingleFeedback from './single-feedback';
import DrawingFeedback from './drawing-feedback';

import processSingleFeedback from './process-feedback-single';
import processDrawingFeedback from './process-feedback-drawing';

counterpart.registerTranslations('en', {
  feedbackSummary: {
    title: 'Feedback on your classification',
  }
});

const feedbackTypes = {
  single: processSingleFeedback,
  drawing: processDrawingFeedback
};

class FeedbackSummary extends React.Component {
  constructor(props) {
    super(props);
    this.generateFeedbackItems = this.generateFeedbackItems.bind(this);
  }

  componentWillMount() {
    this.generateFeedbackItems();
  }

  componentWillUnmount() {
    this.props.actions.feedback.clearFeedback();
  }

  render() {
    return (
      <section>
        <strong>
          <Translate content="feedbackSummary.title" />
        </strong>
        <div className="classification-task-summary-with-feedback">
          insert content
        </div>
      </section>
    );
  }

  generateFeedbackItems() {
    const { classification, subject, workflow } = this.props;
    const feedbackItems = classification.annotations.reduce((allFeedback, annotation) => {
      const props = {
        annotation,
        subject,
        task: workflow.tasks[annotation.task],
      };
      allFeedback.push(feedbackTypes[props.task.type](props));
      return allFeedback;
    }, []);
    this.props.actions.feedback.setFeedback(feedbackItems);
  }

}

const mapDispatchToProps = (dispatch) => ({
  actions: {
    feedback: bindActionCreators(feedbackActions, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(FeedbackSummary);
