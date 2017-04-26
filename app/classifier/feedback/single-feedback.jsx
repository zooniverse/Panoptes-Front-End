import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FeedbackRuleSet from './feedback-ruleset';
import * as feedbackActions from '../../redux/ducks/feedback';

class SingleFeedback extends React.Component {

  componentDidMount() {
    const { annotation, subject, task } = this.props;
    const feedbackRuleSet = new FeedbackRuleSet(subject, task);
    const comparisonValue = (annotation && annotation.value !== null)
      ? annotation.value.toString()
      : '-1';
    const checkedRules = feedbackRuleSet.rules.reduce((checkedRules, rule) => {
      const result = comparisonValue === rule.answerIndex;
      checkedRules.push({
        question: task.question,
        success: result,
        message: (result) ? rule.successMessage : rule.failureMessage,
      });
      return checkedRules;
    }, []);
    console.info(checkedRules)
  }

  render() {
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

export default connect(mapStateToProps, mapDispatchToProps)(SingleFeedback);
