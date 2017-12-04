import { Markdown } from 'markdownz';
import React from 'react';
import GenericTask from '../generic';
import GenericTaskEditor from '../generic-editor';

const NOOP = Function.prototype;

class MultipleChoiceSummary extends React.Component {
  constructor(props) {
    super(props);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.state = {
      expanded: this.props.expanded
    };
  }

  expand() {
    this.setState({ expanded: true });
  }

  collapse() {
    this.setState({ expanded: false });
  }

  render() {
    let toggleButton = <button type="button" className="toggle-more" onClick={this.expand}>More</button>;
    let answers = [<div key={0} className="answer">No answer</div>];
    if (!this.state.expanded && this.props.annotation.value.length > 0) {
      answers = this.props.annotation.value.map((index) => {
        return (
          <div key={index} className="answer">
            <i className="fa fa-check-square-o fa-fw"></i>
            <Markdown tag="span" inline={true}>{this.props.task.answers[index].label}</Markdown>
          </div>
        );
      });
    }
    if (this.state.expanded) {
      toggleButton = <button type="button" className="toggle-more" onClick={this.collapse}>Less</button>;
      answers = [];
      for (const [i, answer] of this.props.task.answers.entries()) {
        if (!answer._key) {
          answer._key = Math.random();
        }
        let icon = <i className="fa fa-square-o fa-fw"></i>;
        if (this.props.annotation.value.includes(i)) {
          icon = <i className="fa fa-check-square-o fa-fw"></i>;
        }
        answers.push(
          <div key={answer._key} className="answer">
            {icon}
            <Markdown tag="span" inline={true}>{answer.label}</Markdown>
          </div>
        );
      }
    }
    return (
      <div>
        <div className="question">
          <Markdown>
            {this.props.task.question}
          </Markdown>
          {toggleButton}
        </div>
        <div className="answers">
          {answers}
        </div>
      </div>
    );
  }
}

MultipleChoiceSummary.propTypes = {
  task: React.PropTypes.shape(
    {
      answers: React.PropTypes.array,
      question: React.PropTypes.string
    }
  ),
  annotation: React.PropTypes.shape(
    { value: React.PropTypes.array }
  ).isRequired,
  expanded: React.PropTypes.bool
};

MultipleChoiceSummary.defaultProps = {
  task: {
    answers: [],
    question: ''
  },
  expanded: false
};

export default class MultipleChoiceTask extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(index, e) {
    const value = this.props.annotation.value.slice(0);
    if (e.target.checked) {
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
      let active = '';
      if (annotation.value.includes(i)) {
        active = 'active';
      }
      answers.push(
        <label key={answer._key} className={`minor-button answer-button ${active}`}>
          <div className="answer-button-icon-container">
            <input
              type="checkbox"
              autoFocus={i === annotation.value[0]}
              checked={annotation.value.includes(i)}
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
        autoFocus={annotation.value.length === 0}
        question={translation.question}
        help={translation.help}
        answers={answers}
        required={task.required}
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
  task: React.PropTypes.shape(
    {
      answers: React.PropTypes.array,
      question: React.PropTypes.string,
      help: React.PropTypes.string,
      required: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.bool
      ])
    }
  ),
  translation: React.PropTypes.shape({
    characteristics: React.PropTypes.object,
    choices: React.PropTypes.object,
    questions: React.PropTypes.object
  }).isRequired,
  annotation: React.PropTypes.shape(
    { value: React.PropTypes.array }
  ),
  onChange: React.PropTypes.func
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
  onChange: NOOP
};
