import { Markdown } from 'markdownz';
import React from 'react';
import GenericTask from '../generic';
import GenericTaskEditor from '../generic-editor';
import SingleChoiceSummary from './summary';

const NOOP = Function.prototype;

export default class SingleChoiceTask extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(index, e) {
    if (e.target.checked) {
      const newAnnotation = Object.assign({}, this.props.annotation, { value: index });
      this.props.onChange(newAnnotation);
    }
  }

  render() {
    const { annotation, task, translation } = this.props;
    const answers = [];
    for (const [i, answer] of task.answers.entries()) {
      if (!answer._key) {
        answer._key = Math.random();
      }
      let active = '';
      if (i === annotation.value) {
        active = 'active';
      }
      answers.push(
        <label key={answer._key} className={`minor-button answer-button ${active}`}>
          <div className="answer-button-icon-container">
            <input
              type="radio"
              autoFocus={i === annotation.value}
              checked={i === annotation.value}
              value={i}
              onChange={this.handleChange.bind(this, i)}
            />
          </div>
          <div className="answer-button-label-container">
            <Markdown className="answer-button-label">{translation.answers[i].label}</Markdown>
          </div>
        </label>
      );
    }
    return (
      <GenericTask
        autoFocus = {annotation.value === null}
        question={translation.question}
        help={translation.help}
        answers={answers}
        required={task.required}
      />
    );
  }
}

// Define the static methods and values
SingleChoiceTask.Editor = GenericTaskEditor;
SingleChoiceTask.Summary = SingleChoiceSummary;
SingleChoiceTask.getDefaultTask = () => {
  return {
    type: 'single',
    question: 'Enter a question.',
    help: '',
    answers: []
  };
};
SingleChoiceTask.getTaskText = (task) => {
  return task.question;
};
SingleChoiceTask.getDefaultAnnotation = () => {
  return { value: null };
};
SingleChoiceTask.isAnnotationComplete = (task, annotation) => {
  return (!task.required || annotation.value !== null);
};

SingleChoiceTask.propTypes = {
  task: React.PropTypes.shape(
    {
      answers: React.PropTypes.array,
      question: React.PropTypes.string,
      help: React.PropTypes.string,
      required: React.PropTypes.bool
    }
  ),
  translation: React.PropTypes.shape({
    characteristics: React.PropTypes.object,
    choices: React.PropTypes.object,
    questions: React.PropTypes.object
  }).isRequired,
  annotation: React.PropTypes.shape(
    { value: React.PropTypes.number }
  ),
  onChange: React.PropTypes.func
};

SingleChoiceTask.defaultProps = {
  task: {
    answers: [],
    question: '',
    help: '',
    required: false
  },
  translation: {
    answers: [],
    question: '',
    help: ''
  },
  annotation: { value: null },
  onChange: NOOP
};
