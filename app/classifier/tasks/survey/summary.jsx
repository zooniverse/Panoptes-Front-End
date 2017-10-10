import React from 'react';
import Translate from 'react-translate-component';

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
    const { task, annotation, translation } = this.props;
    const choiceSummaries = annotation.value.map((identification) => {
      const allAnswers = Object.keys(identification.answers).map((questionId) => {
        const answerKeys = [].concat(identification.answers[questionId]);
        const answers = answerKeys.map(answerId => translation.questions[questionId].answers[answerId].label);
        return answers.join(', ');
      });
      return `${translation.choices[identification.choice].label}: ${allAnswers.join('; ')}`;
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
  }),
  translation: React.PropTypes.shape({
    characteristics: React.PropTypes.object,
    choices: React.PropTypes.object,
    questions: React.PropTypes.object
  }).isRequired
};

SurveySummary.defaultProps = {
  task: null,
  annotation: null,
  expanded: false
};

export default SurveySummary;
