// Allowing object / array propTypes as we're simply passing them to children.
/* eslint
  react/forbid-prop-types: 0
*/

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FeedbackSummary from './feedback-summary';
import * as feedbackActions from '../../redux/ducks/feedback';
import processSingleFeedback from './process-feedback-single';
import processDrawingFeedback from './process-feedback-drawing';

const processFeedback = {
  single: processSingleFeedback,
  drawing: processDrawingFeedback
};

class FeedbackSummaryContainer extends React.Component {
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

  generateFeedbackItems() {
    const { actions, classification, subject, workflow } = this.props;
    const feedbackItems = classification.annotations.reduce((allFeedback, annotation) => {
      const task = workflow.tasks[annotation.task];
      return allFeedback.concat(processFeedback[task.type](annotation, subject, task));
    }, []);
    actions.feedback.setFeedback(feedbackItems);
  }

  render() {
    return (this.props.feedback.length) ? <FeedbackSummary feedback={this.props.feedback} /> : null;
  }
}

FeedbackSummaryContainer.propTypes = {
  actions: PropTypes.shape({
    feedback: PropTypes.object
  }),
  classification: PropTypes.object,
  feedback: PropTypes.array,
  subject: PropTypes.object,
  workflow: PropTypes.object
};

const mapStateToProps = state => ({
  feedback: state.feedback.filter(item => item.target === 'summary')
});

const mapDispatchToProps = dispatch => ({
  actions: {
    feedback: bindActionCreators(feedbackActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackSummaryContainer);
