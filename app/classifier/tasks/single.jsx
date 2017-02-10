import { Markdown } from 'markdownz';
import React from 'react';
import GenericTask from './generic';
import GenericTaskEditor from './generic-editor';

const NOOP = Function.prototype;

class Summary extends React.Component {
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
    let answers = <div className="answer">No answer</div>;
    if (!this.state.expanded && this.props.annotation.value) {
      answers = (
        <div className="answer">
          <i className="fa fa-check-circle-o fa-fw"></i>
          <Markdown tag="span" inline={true}>{this.props.task.answers[this.props.annotation.value].label}</Markdown>
        </div>
      );
    }
    if (this.state.expanded) {
      toggleButton = <button type="button" className="toggle-more" onClick={this.collapse}>Less</button>;
      answers = [];
      for (const [i, answer] of this.props.task.answers.entries()) {
        if (!answer._key) {
          answer._key = Math.random();
        }
        let icon = <i className="fa fa-circle-o fa-fw"></i>;
        if (i === this.props.annotation.value) {
          icon = <i className="fa fa-check-circle-o fa-fw"></i>;
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

Summary.propTypes = {
  task: React.PropTypes.shape(
    {
      answers: React.PropTypes.array,
      question: React.PropTypes.string
    }
  ),
  annotation: React.PropTypes.shape(
    { value: React.PropTypes.number }
  ).isRequired,
  expanded: React.PropTypes.bool
};

Summary.defaultProps = {
  task: {
    answers: [],
    question: ''
  },
  expanded: false
};

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
    const answers = [];
    for (const [i, answer] of this.props.task.answers.entries()) {
      if (!answer._key) {
        answer._key = Math.random();
      }
      let active = '';
      if (i === this.props.annotation.value) {
        active = 'active';
      }
      answers.push(
        <label key={answer._key} className={`minor-button answer-button ${active}`}>
          <div className="answer-button-icon-container">
            <input
              type="radio"
              checked={i === this.props.annotation.value}
              value={i}
              onChange={this.handleChange.bind(this, i)}
            />
          </div>
          <div className="answer-button-label-container">
            <Markdown className="answer-button-label">{answer.label}</Markdown>
          </div>
        </label>
      );
    }
    return (
      <GenericTask
        question={this.props.task.question}
        help={this.props.task.help}
        answers={answers}
        required={this.props.task.required}
      />
    );
  }
}

// Define the static methods and values
SingleChoiceTask.Editor = GenericTaskEditor;
SingleChoiceTask.Summary = Summary;
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
  annotation: { value: null },
  onChange: NOOP
};
