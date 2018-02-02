import PropTypes from 'prop-types';
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

  handleRadioToggle(questionId, answerId, e) {
    const { type } = e.target;
    const { answers } = this.state;
    if (type === 'radio' && answers[questionId] === answerId) {
      delete answers[questionId];
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
                return (
                  <span key={otherChoiceID}>
                    <TriggeredModalForm
                      className="survey-task-confusions-modal"
                      triggerProps={{ autoFocus: !hasFocus && i === 0 }}
                      trigger={
                        <span className="survey-task-choice-confusion">
                          {this.props.translation.choices[otherChoiceID].label}
                        </span>
                      }
                      style={{ maxWidth: '60ch' }}
                    >
                      <ImageFlipper images={otherChoice.images.map(filename => this.props.task.images[filename])} />
                      <Markdown content={this.props.translation.choices[this.props.choiceID].confusions[otherChoiceID]} />
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
            Utility.getQuestionIDs(task, choiceID).map((questionId) => {
              const question = task.questions[questionId] || { answers: {}, answersOrder: [] };
              const inputType = question.multiple ? 'checkbox' : 'radio';
              return (
                <div key={questionId} className="survey-task-choice-question" data-multiple={question.multiple || null}>
                <div className="survey-task-choice-question-label">{translation.questions[questionId].label}</div>
                  {question.answersOrder.map((answerId, i) => {
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
                            onClick={this.handleRadioToggle.bind(this, questionId, answerId)}
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
              );
            })
          }
          {Utility.getQuestionIDs(task, choiceID).length > 0 && <hr />}
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