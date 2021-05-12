import PropTypes from 'prop-types';
import React from 'react';

import GenericTask from '../generic';
import GenericTaskEditor from '../generic-editor';
import SubjectGroupComparisonSummary from './summary';
import TaskInputField from '../components/TaskInputField';

const NOOP = Function.prototype;

export default class SubjectGroupComparisonTask extends React.Component {
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
    return (
      <GenericTask
        autoFocus={autoFocus && annotation.value === null}
        question={translation.question}
        help={translation.help}
        required={task.required}
        showRequiredNotice={this.props.showRequiredNotice}
      />
    );
  }
}

// Define the static methods and values
SubjectGroupComparisonTask.Editor = GenericTaskEditor;
SubjectGroupComparisonTask.Summary = SubjectGroupComparisonSummary;
SubjectGroupComparisonTask.getDefaultTask = () => {
  return {
    type: 'subjectGroupComparison',
    question: 'Enter a question.',
    help: '',
  };
};
SubjectGroupComparisonTask.getTaskText = (task) => {
  return task.question;
};
SubjectGroupComparisonTask.getDefaultAnnotation = () => {
  return { value: null };
};
SubjectGroupComparisonTask.isAnnotationComplete = (task, annotation) => {
  return (!task.required || annotation.value !== null);
};

SubjectGroupComparisonTask.propTypes = {
  task: PropTypes.shape(
    {
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

SubjectGroupComparisonTask.defaultProps = {
  task: {
    question: '',
    help: '',
    required: false
  },
  translation: {
    question: '',
    help: ''
  },
  annotation: { value: null },
  autoFocus: false,
  onChange: NOOP,
  showRequiredNotice: false
};
