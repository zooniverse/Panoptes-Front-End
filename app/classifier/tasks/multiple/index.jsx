import PropTypes from 'prop-types';
import React from 'react';
import GenericTask from '../generic';
import GenericTaskEditor from '../generic-editor';
import MultipleChoiceSummary from './summary';
import TaskInputField from '../components/TaskInputField';

const NOOP = Function.prototype;

export default class MultipleChoiceTask extends React.Component {
  handleChange(index, e) {
    const value = this.props.annotation.value.slice(0);
    if (e.target.checked) {
      this.setState({ focus: {} });
      if (!value.includes(index)) {
        value.push(index);
      }
    } else if (value.includes(index)) {
      const indexInValue = value.indexOf(index);
      value.splice(indexInValue, 1);
    }
    const newAnnotation = Object.assign({}, this.props.annotation, { value });
    this.props.onChange(newAnnotation);
  }

  render() {
    const { annotation, task, translation } = this.props;
    const answers = [];
    for (const [i, answer] of task.answers.entries()) {
      if (!answer._key) {
        answer._key = Math.random();
      }

      answers.push(
        <TaskInputField
          annotation={annotation}
          className={annotation.value.includes(i) ? 'active' : ''}
          index={i}
          key={answer._key}
          label={translation.answers[i].label}
          onChange={this.handleChange.bind(this, i)}
          type="checkbox"
        />
      );
    }
    return (
      <GenericTask
        autoFocus={annotation.value.length === 0}
        question={translation.question}
        help={translation.help}
        answers={answers}
        required={task.required}
        showRequiredNotice={this.props.showRequiredNotice}
      />
    );
  }
}

// Define the static methods and values
MultipleChoiceTask.Editor = GenericTaskEditor;
MultipleChoiceTask.Summary = MultipleChoiceSummary;
MultipleChoiceTask.getDefaultTask = () => {
  return {
    type: 'multiple',
    question: 'Enter a question.',
    help: '',
    answers: []
  };
};
MultipleChoiceTask.getTaskText = (task) => {
  return task.question;
};
MultipleChoiceTask.getDefaultAnnotation = () => {
  return { value: [] };
};
MultipleChoiceTask.isAnnotationComplete = (task, annotation) => {
  // Booleans compare to numbers as expected: true = 1, false = 0. Undefined does not.
  // if task.required is undefined or null this will always return true
  return annotation.value.length >= (task.required != null ? task.required : 0);
};

MultipleChoiceTask.propTypes = {
  task: PropTypes.shape(
    {
      answers: PropTypes.array,
      question: PropTypes.string,
      help: PropTypes.string,
      required: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.bool
      ])
    }
  ),
  translation: PropTypes.shape({
    characteristics: PropTypes.object,
    choices: PropTypes.object,
    questions: PropTypes.object
  }).isRequired,
  annotation: PropTypes.shape(
    { value: PropTypes.array }
  ),
  onChange: PropTypes.func,
  showRequiredNotice: PropTypes.bool
};

MultipleChoiceTask.defaultProps = {
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
  annotation: { value: [] },
  onChange: NOOP,
  showRequiredNotice: false
};