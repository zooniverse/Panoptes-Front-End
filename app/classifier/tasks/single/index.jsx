import { Markdown } from 'markdownz';
import PropTypes from 'prop-types';
import React from 'react';
import GenericTask from '../generic';
import GenericTaskEditor from '../generic-editor';
import SingleChoiceSummary from './summary';

const NOOP = Function.prototype;

export default class SingleChoiceTask extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      focus: {}
    };
  }

  handleChange(index, e) {
    if (e.target.checked) {
      this.setState({ focus: {} });
      const newAnnotation = Object.assign({}, this.props.annotation, { value: index });
      this.props.onChange(newAnnotation);
    }
  }

  // for keyboard accessibility
  onFocus(index) {
    if (this.props.annotation.value !== index) {
      this.setState({ focus: { [index]: true } });
    }
  }

  onBlur() {
    this.setState({ focus: {} });
  }

  render() {
    const { annotation, task, translation } = this.props;
    if (!task._key) {
      task._key = Math.random();
    }
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
        <label key={answer._key} className={`answer-button ${active}`} data-focus={this.state.focus[i] || false}>
          <div className="answer-button-icon-container">
            <input
              type="radio"
              autoFocus={i === annotation.value}
              checked={i === annotation.value}
              value={i}
              onChange={this.handleChange.bind(this, i)}
              onFocus={this.onFocus.bind(this, i)}
              onBlur={this.onBlur.bind(this)}
              name={`${task._key}`}
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
        autoFocus={annotation.value === null}
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
  task: PropTypes.shape(
    {
      answers: PropTypes.array,
      question: PropTypes.string,
      help: PropTypes.string,
      required: PropTypes.bool
    }
  ),
  translation: PropTypes.shape({
    characteristics: PropTypes.object,
    choices: PropTypes.object,
    questions: PropTypes.object
  }).isRequired,
  annotation: PropTypes.shape(
    { value: PropTypes.number }
  ),
  onChange: PropTypes.func
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
