import React from 'react';
import Translate from 'react-translate-component';
import Utility from './utility';

class SurveySummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded
    };
  }

  setExpanded(expanded) {
    this.setState({ expanded });
  }

  render() {
    const { task, annotation } = this.props;
    const choiceSummaries = annotation.value.map((identification) => {
      const choice = task.choices[identification.choice];
      const questionIds = Utility.getQuestionIDs(task, identification.choice);
      const filteredQuestionIds = questionIds.filter(questionId => Object.keys(identification.answers).indexOf(questionId) > -1);
      const allAnswers = filteredQuestionIds.map(questionId =>
        [].concat(identification.answers[questionId])
        .map(answerId => task.questions[questionId].answers[answerId].label)
        .join(', ')
      );
      return `${choice.label}: ${allAnswers.join('; ')}`;
    });
    return (
      <div>
        <div className="question">
          <Translate
            content="tasks.survey.surveyOf"
            with={{
              count: task.choicesOrder.length
            }}
          />
          {this.state.expanded ?
            <button type="button" className="toggle-more" onClick={this.setExpanded.bind(this, false)}>
              <Translate content="tasks.less" />
            </button> :
            <button type="button" className="toggle-more" onClick={this.setExpanded.bind(this, true)}>
              <Translate content="tasks.more" />
            </button>}
        </div>
        <div className="answers">
          <div className="answer">
            <Translate
              content="tasks.survey.identifications"
              with={{
                count: annotation.value.length
              }}
            />
          </div>
          {this.state.expanded &&
            choiceSummaries.map((choiceSummary, i) => (
              <div key={i} className="answer">
                {choiceSummary}
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

SurveySummary.propTypes = {
  annotation: React.PropTypes.shape({
    value: React.PropTypes.array
  }),
  expanded: React.PropTypes.bool,
  task: React.PropTypes.shape({
    choices: React.PropTypes.object,
    choicesOrder: React.PropTypes.array,
    questions: React.PropTypes.object
  })
};

SurveySummary.defaultProps = {
  task: null,
  annotation: null,
  expanded: false
};

export default SurveySummary;
