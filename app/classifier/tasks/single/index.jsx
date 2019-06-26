import PropTypes from 'prop-types';
import React from 'react';

import GenericTask from '../generic';
import GenericTaskEditor from '../generic-editor';
import SingleChoiceSummary from './summary';
import TaskInputField from '../components/TaskInputField';

const NOOP = Function.prototype;

export default class SingleChoiceTask extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange(index, e) {
    if (e.target.checked) {
      const newAnnotation = Object.assign({}, this.props.annotation, { value: index });
      this.props.onChange(newAnnotation);
    }
  }

  render() {
    const { annotation, autoFocus, task, translation } = this.props;
    if (!task._key) {
      task._key = Math.random();
    }
    const answers = [];
    for (const [i, answer] of task.answers.entries()) {
      if (!answer._key) {
        answer._key = Math.random();
      }
      const checked = i === annotation.value;

      answers.push(
        <TaskInputField
          autoFocus={autoFocus && checked}
          checked={checked}
          className={checked ? 'active' : ''}
          index={i}
          key={answer._key}
          label={translation.answers[i].label}
          name={`${task._key}`}
          onChange={this.handleChange.bind(this, i)}
          type="radio"
        />
      );
    }
    return (
      <GenericTask
        autoFocus={autoFocus && annotation.value === null}
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
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  showRequiredNotice: PropTypes.bool
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
  autoFocus: false,
  onChange: NOOP,
  showRequiredNotice: false
};
