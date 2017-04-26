import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as feedbackActions from '../../redux/ducks/feedback';
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
    this.renderFeedbackSummary = this.renderFeedbackSummary.bind(this);
    this.generateFeedbackItems = this.generateFeedbackItems.bind(this);
  }

  componentWillMount() {
    this.generateFeedbackItems();
  }

  componentWillUnmount() {
    this.props.actions.feedback.clearFeedback();
  }

  render() {
    return (this.props.feedback.length) ? this.renderFeedbackSummary() : null;
  }

  generateFeedbackItems() {
    const { actions, classification, subject, workflow } = this.props;
    const feedbackItems = classification.annotations.reduce((allFeedback, annotation) => {
      const props = {
        annotation,
        subject,
        task: workflow.tasks[annotation.task],
      };
      allFeedback.push(feedbackTypes[props.task.type](props));
      return allFeedback;
    }, []);
    actions.feedback.setFeedback(feedbackItems);
  }

  renderFeedbackSummary() {
    const textFeedback = this.props.feedback.filter(item => item.type === 'single');
    console.info('textFeedback',textFeedback)
    return (
      <section>
        <strong>
          <Translate content="feedbackSummary.title" />
        </strong>
        <div className="classification-task-summary-with-feedback">
          {textFeedback.map(item => (
            <ul key={`feedback-item-${item.task}`}>
              <li>
                <p>{item.feedback[0].question}</p>
                <ul>
                  {item.feedback.map(feedbackItem => (
                    <li>{feedbackItem.message}</li>
                  ))}
                </ul>
              </li>
            </ul>
          ))}
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  feedback: state.feedback,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    feedback: bindActionCreators(feedbackActions, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackSummary);
