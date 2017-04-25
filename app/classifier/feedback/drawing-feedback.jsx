import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FeedbackRuleSet from './feedback-ruleset';
import * as feedbackActions from '../../redux/ducks/feedback';

const isWithinTolerance = (annotationX, annotationY, feedbackX, feedbackY, tolerance) => {
  const distance = Math.sqrt(Math.pow((annotationY - feedbackY), 2) + Math.pow((annotationX - feedbackX), 2));
  return distance < tolerance;
};

class DrawingFeedback extends React.Component {

  componentDidMount() {
    const feedbackRuleSet = new FeedbackRuleSet(this.props.subject, this.props.task);
    const checkedRules = feedbackRuleSet.rules.reduce((checkedRules, rule) => {
      const result = this.props.annotation.value.reduce((found, point) => {
        if (isWithinTolerance(point.x, point.y, parseInt(rule.x, 10), parseInt(rule.y, 10), parseInt(rule.tol, 10))) {
          found = true;
        }
        return found;
      }, false);

      checkedRules.push({
        x: rule.x,
        y: rule.y,
        tol: rule.tol,
        success: result,
        message: (result) ? rule.successMessage : rule.failureMessage,
      });
      return checkedRules;
    }, []);
    console.info('checkedRules', checkedRules);
    this.props.actions.feedback.setFeedback({ classifier: checkedRules });
  }

  render() {
    console.log('active', this);
    return <p>foo</p>;
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

export default connect(mapStateToProps, mapDispatchToProps)(DrawingFeedback);
