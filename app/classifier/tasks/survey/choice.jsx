import React from 'react';
import TriggeredModalForm from 'modal-form/triggered';
import { Markdown } from 'markdownz';
import Translate from 'react-translate-component';
import ImageFlipper from './image-flipper';
import Utility from './utility';


class Choice extends React.Component {
  constructor(props) {
    super(props);
    this.handleIdentification = this.handleIdentification.bind(this);
    this.state = {
      answers: Object.assign({}, props.annotationValue.answers),
      focusedAnswer: ''
    };
  }

  checkFilledIn() {
    // if there are no questions, don't make them fill one in
    if (Utility.getQuestionIDs(this.props.task, this.props.choiceID).length === 0) {
      return true;
    }

    // if there are questions, it's fine as long as they've filled required ones in
    const answerProvided = [];
    Utility.getQuestionIDs(this.props.task, this.props.choiceID).map((questionId) => {
      const question = this.props.task.questions[questionId];
      if (question.required) {
        const answer = this.state.answers[questionId];
        if (answer && answer.length > 0) {
          answerProvided.push(true);
        } else {
          answerProvided.push(false);
        }
      } else {
        answerProvided.push(true);
      }
    });
    return answerProvided.every(answer => (answer === true));
  }

  handleAnswer(questionId, answerId, e) {
    const { answers } = this.state;
    answers[questionId] = answers[questionId] ? answers[questionId] : [];
    if (this.props.task.questions[questionId].multiple) {
      if (e.target.checked) {
        answers[questionId].push(answerId);
      } else {
        answers[questionId].splice(answers[questionId].indexOf(answerId), 1);
      }
    } else {
      if (answerId === answers[questionId]) {
        delete answers[questionId];
        this.refs[questionId].checked = false;
      } else {
        answers[questionId] = answerId;
      }
    }
    this.setState({ answers });
  }

  handleFocus(questionId, answerId) {
    if (questionId && answerId) {
      this.setState({ focusedAnswer: `${questionId}/${answerId}` });
    } else {
      this.setState({ focusedAnswer: '' });
    }
  }

  handleIdentification() {
    this.props.onConfirm(this.props.choiceID, this.state.answers);
  }

  render() {
    const choice = this.props.task.choices[this.props.choiceID];
    let hasFocus = choice.images.length > 1;
    return (
      <div className="survey-task-choice">
        {choice.images.length > 0 &&
          <ImageFlipper
            images={choice.images.map(filename => this.props.task.images[filename])}
          />
        }
        <div className="survey-task-choice-content">
          <div className="survey-task-choice-label">{choice.label}</div>
          <div className="survey-task-choice-description">{choice.description}</div>

          {choice.confusionsOrder.length > 0 &&
            <div className="survey-task-choice-confusions">
              <Translate content="tasks.survey.confused" />
              {' '}
              {choice.confusionsOrder.map((otherChoiceID, i) => {
                const otherChoice = this.props.task.choices[otherChoiceID];
                return (
                  <span key={otherChoiceID}>
                    <TriggeredModalForm
                      className="survey-task-confusions-modal"
                      triggerProps={{ autoFocus: !hasFocus && i === 0 }}
                      trigger={
                        <span className="survey-task-choice-confusion">
                          {otherChoice.label}
                        </span>
                      }
                      style={{ maxWidth: '60ch' }}
                    >
                      <ImageFlipper images={otherChoice.images.map(filename => this.props.task.images[filename])} />
                      <Markdown content={choice.confusions[otherChoiceID]} />
                      <div className="survey-task-choice-confusion-buttons" style={{ textAlign: 'center' }}>
                        <button
                          type="submit"
                          autoFocus={true && otherChoice.images.length < 2}
                          className="major-button identfiy"
                        >
                          <Translate content="tasks.survey.dismiss" />
                        </button>
                        {' '}
                        <button
                          type="button"
                          className="standard-button cancel"
                          onClick={this.props.onSwitch.bind(null, otherChoiceID)}
                        >
                          <Translate content="tasks.survey.itsThis" />
                        </button>
                      </div>
                    </TriggeredModalForm>
                    {' '}
                    {hasFocus = true}
                  </span>
                );
              })}
            </div>
          }

          <hr />

          {!choice.noQuestions &&
            Utility.getQuestionIDs(this.props.task, this.props.choiceID).map((questionId) => {
              const question = this.props.task.questions[questionId];
              const inputType = question.multiple ? 'checkbox' : 'radio';
              return (
                <div key={questionId} className="survey-task-choice-question" data-multiple={question.multiple || null}>
                  <div className="survey-task-choice-question-label">{question.label}</div>
                  {question.answersOrder.map((answerId, i) => {
                    const answer = question.answers[answerId];
                    const isChecked = question.multiple ?
                      !!this.state.answers[questionId] && this.state.answers[questionId].indexOf(answerId) > -1 :
                      this.state.answers[questionId] === answerId;
                    const isFocused = this.state.focusedAnswer === `${questionId}/${answerId}`;
                    return (
                      <span key={answerId}>
                        <label
                          className="survey-task-choice-answer"
                          data-checked={isChecked || null}
                          data-focused={isFocused || null}
                        >
                          <input
                            ref={questionId}
                            name={questionId}
                            type={inputType}
                            autoFocus={!hasFocus && i === 0}
                            checked={isChecked}
                            onChange={this.handleAnswer.bind(this, questionId, answerId)}
                            onFocus={this.handleFocus.bind(this, questionId, answerId)}
                            onBlur={this.handleFocus.bind(this, null, null)}
                          />
                          {answer.label}
                        </label>
                        {' '}
                        {hasFocus = true}
                      </span>
                    );
                  })}
                </div>
              );
            })
          }
          {Utility.getQuestionIDs(this.props.task, this.props.choiceID).length > 0 && <hr />}
        </div>
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            autoFocus={!hasFocus}
            className="minor-button"
            onClick={this.props.onCancel}
          >
            <Translate content="tasks.survey.cancel" />
          </button>
          {' '}
          <button
            type="button"
            className="standard-button"
            disabled={!this.checkFilledIn()}
            onClick={this.handleIdentification}
          >
            <strong><Translate content="tasks.survey.identify" /></strong>
          </button>
        </div>
      </div>
    );
  }
}

Choice.propTypes = {
  annotationValue: React.PropTypes.shape({
    answers: React.PropTypes.object,
    choice: React.PropTypes.string,
    filters: React.PropTypes.object
  }),
  choiceID: React.PropTypes.string,
  onCancel: React.PropTypes.func,
  onConfirm: React.PropTypes.func,
  onSwitch: React.PropTypes.func,
  task: React.PropTypes.shape({
    choices: React.PropTypes.object,
    images: React.PropTypes.object,
    questions: React.PropTypes.object
  })
};

Choice.defaultProps = {
  annotationValue: { answers: {}},
  task: null,
  choiceID: '',
  onSwitch: Function.prototype,
  onConfirm: Function.prototype,
  onCancel: Function.prototype
};

export default Choice;
