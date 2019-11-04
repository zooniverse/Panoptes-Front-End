import PropTypes from 'prop-types';
import React from 'react';
import TriggeredModalForm from 'modal-form/triggered';
import { Markdown } from 'markdownz';
import Translate from 'react-translate-component';
import ImageFlipper from './image-flipper';
import { getQuestionIDs } from './utility';

const BACKSPACE = 8;
const SPACE = 32;


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
    if (getQuestionIDs(this.props.task, this.props.choiceID).length === 0) {
      return true;
    }

    // if there are questions, it's fine as long as they've filled required ones in
    const answerProvided = [];
    getQuestionIDs(this.props.task, this.props.choiceID).map((questionId) => {
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

  handleAnswer(e) {
    const { name, value } = e.target;
    const { answers } = this.state;
    answers[name] = answers[name] ? answers[name] : [];
    if (this.props.task.questions[name].multiple) {
      if (e.target.checked) {
        answers[name].push(value);
      } else {
        answers[name].splice(answers[name].indexOf(value), 1);
      }
    } else {
      answers[name] = value;
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

  handleRadioKeyDown(e) {
    const { type, checked } = e.target;
    const isRadio = type === 'radio';
    switch (e.which) {
      case BACKSPACE:
      case SPACE:
        if (isRadio && checked) {
          e.preventDefault();
          this.resetSingleAnswerQuestion(e);
        }
        break;
      default:
    }
  }

  resetSingleAnswerQuestion(e) {
    const { type, name, value } = e.target;
    const { answers } = this.state;
    if (type === 'radio' && answers[name] === value) {
      delete answers[name];
      this.setState({ answers });
    }
  }

  render() {
    const { choiceID, task, translation } = this.props;
    const choice = task.choices[this.props.choiceID];
    let hasFocus = choice.images.length > 1;
    return (
      <div className="survey-task-choice">
        {choice.images.length > 0 &&
          <ImageFlipper
            images={choice.images.map(filename => task.images[filename])}
          />
        }
        <div className="survey-task-choice-content">
          <div className="survey-task-choice-label">{translation.choices[choiceID].label}</div>
          <div className="survey-task-choice-description">{translation.choices[choiceID].description}</div>

          {choice.confusionsOrder.length > 0 &&
            <div className="survey-task-choice-confusions">
              <Translate content="tasks.survey.confused" />
              {' '}
              {choice.confusionsOrder.map((otherChoiceID, i) => {
                const otherChoice = this.props.task.choices[otherChoiceID] || { label: '', images: [] };
                const currentChoiceTranslation = this.props.translation.choices[this.props.choiceID]
                const otherChoiceTranslation = this.props.translation.choices[otherChoiceID]
                const autoFocus = !hasFocus && i === 0;
                return (
                  <span key={otherChoiceID}>
                    <TriggeredModalForm
                      className="survey-task-confusions-modal"
                      triggerProps={{ autoFocus }}
                      trigger={
                        <span className="survey-task-choice-confusion">
                          {otherChoiceTranslation.label}
                        </span>
                      }
                      style={{ maxWidth: '60ch' }}
                    >
                      <ImageFlipper images={otherChoice.images.map(filename => this.props.task.images[filename])} />
                      <Markdown
                        content={currentChoiceTranslation.confusions[otherChoiceID]}
                      />
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
            getQuestionIDs(task, choiceID).map((questionId) => {
              const question = task.questions[questionId] || { answers: {}, answersOrder: [] };
              const inputType = question.multiple ? 'checkbox' : 'radio';
              return (
                <div key={questionId} className="survey-task-choice-question" data-multiple={question.multiple || null}>
                  <div className="survey-task-choice-question-label">
                    {translation.questions[questionId].label}
                  </div>
                  <div className="survey-task-choice-answers">
                    {question.answersOrder.map((answerId, i) => {
                      /* eslint-disable multiline-ternary */
                      const isChecked = question.multiple ?
                        !!this.state.answers[questionId] && this.state.answers[questionId].indexOf(answerId) > -1 :
                        this.state.answers[questionId] === answerId;
                      /* eslint-enable multiline-ternary */
                      const isFocused = this.state.focusedAnswer === `${questionId}/${answerId}`;
                      return (
                        <span key={answerId}>
                          <label
                            className="survey-task-choice-answer"
                            data-checked={isChecked || null}
                            data-focused={isFocused || null}
                          >
                            <input
                              name={questionId}
                              value={answerId}
                              type={inputType}
                              autoFocus={!hasFocus && i === 0}
                              checked={isChecked}
                              onChange={this.handleAnswer.bind(this)}
                              onClick={this.resetSingleAnswerQuestion.bind(this)}
                              onKeyDown={this.handleRadioKeyDown.bind(this)}
                              onFocus={this.handleFocus.bind(this, questionId, answerId)}
                              onBlur={this.handleFocus.bind(this, null, null)}
                            />
                            {translation.questions[questionId].answers[answerId].label}
                          </label>
                          {' '}
                          {hasFocus = true}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })
          }
          {getQuestionIDs(task, choiceID).length > 0 && <hr />}
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
  annotationValue: PropTypes.shape({
    answers: PropTypes.object,
    choice: PropTypes.string,
    filters: PropTypes.object
  }),
  choiceID: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onSwitch: PropTypes.func,
  task: PropTypes.shape({
    choices: PropTypes.object,
    images: PropTypes.object,
    questions: PropTypes.object
  }),
  translation: PropTypes.shape({
    characteristics: PropTypes.object,
    choices: PropTypes.object,
    questions: PropTypes.object
  }).isRequired
};

Choice.defaultProps = {
  annotation: {
    task: '',
    value: []
  },
  annotationValue: { answers: {}},
  task: null,
  choiceID: '',
  onSwitch: Function.prototype,
  onConfirm: Function.prototype,
  onCancel: Function.prototype
};

export default Choice;
