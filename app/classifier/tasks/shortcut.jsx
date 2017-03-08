import React from 'react';
import { Markdown } from 'markdownz';

class Summary extends React.Component {
  render() {
    let answer;

    if (this.props.annotation.value != null) {
      answer = (
        <div className="answer">
          <i className="fa fa-check-circle-o fa-fw" />
          <Markdown tag="span" inline={true}>{this.props.task.answers[this.props.annotation.value].label}</Markdown>
        </div>
      );
    } else {
      answer = <div className="answer">No answer</div>;
    }

    return (
      <div>
        <div className="question">
          {this.props.task.question}
        </div>
        <div className="answers">
          {answer}
        </div>
      </div>
    );
  }
}

Summary.propTypes = {
  annotation: React.PropTypes.shape(
    { value: React.PropTypes.number }
  ).isRequired,
  task: React.PropTypes.shape(
    {
      answers: React.PropTypes.array,
      question: React.PropTypes.string
    }
  )
};

Summary.defaultProps = {
  annotation: { },
  task: {
    answers: [],
    question: ''
  }
};

export default class Shortcut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.annotation.task !== this.props.annotation.task) {
      this.setState({ index: null });
    }
  }

  toggleShortcut(i, shortcut, e) {
    if (e.target.checked) {
      this.props.annotation.shortcut = { index: i };
      this.setState({ index: i });
    } else {
      delete (this.props.annotation.shortcut);
      this.setState({ index: null });
      this.props.classification.update('annotations');
    }
  }

  render() {
    const options = this.props.workflow.tasks[this.props.task.unlinkedTask].answers;

    return (
      <div className="unlinked-shortcut">

        {options.map((answer, i) => {
          if (answer._key === undefined) { answer._key = Math.random(); }
          return (
            <p key={answer._key}>
              <label htmlFor={`shortcut-${i}`} className={`answer minor-button answer-button ${i === this.state.index ? 'active' : ''}`}>
                <small>
                  <strong>
                    <input id={`shortcut-${i}`} type="checkbox" checked={i === this.state.index} onChange={this.toggleShortcut.bind(this, i, answer)} />
                    {' '}{answer.label}
                  </strong>
                </small>
              </label>
            </p>
          );
        })}

      </div>
    );
  }

}

Shortcut.Summary = Summary;

Shortcut.getDefaultTask = (question) => {
  return {
    answers: [],
    type: 'shortcut',
    question
  };
};

Shortcut.getDefaultAnnotation = () => {
  return {
    _key: Math.random(),
    value: null
  };
};

Shortcut.propTypes = {
  annotation: React.PropTypes.shape(
    {
      shortcut: React.PropTypes.object,
      task: React.PropTypes.string
    }
  ),
  classification: React.PropTypes.shape(
    {
      annotations: React.PropTypes.array,
      update: React.PropTypes.func
    }
  ),
  task: React.PropTypes.shape(
    { unlinkedTask: React.PropTypes.string }
  ),
  workflow: React.PropTypes.shape(
    { tasks: React.PropTypes.object }
  )
};

Shortcut.defaultProps = {
  annotation: { value: null },
  classification: { },
  task: { },
  workflow: { }
};
