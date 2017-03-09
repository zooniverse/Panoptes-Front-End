import React from 'react';
import { Markdown } from 'markdownz';

class Summary extends React.Component {
  render() {
    let answer;

    if (this.props.annotation.value != null) {
      answer = this.props.annotation.value.map((index) => {
        return (
          <div key={index} className="answer">
            <i className="fa fa-check-circle-o fa-fw" />
            <Markdown tag="span" inline={true}>{this.props.task.answers[index].label}</Markdown>
          </div>
        );
      });
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
    { value: React.PropTypes.array }
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

  toggleShortcut(index, e) {
    const value = this.props.annotation.shortcut ? this.props.annotation.shortcut.value : [];
    let newAnnotation;
    if (e.target.checked) {
      if (!value.includes(index)) {
        value.push(index);
      }
    } else if (value.includes(index)) {
      const indexInValue = value.indexOf(index);
      value.splice(indexInValue, 1);
    }
    if (value.length) {
      newAnnotation = Object.assign({}, this.props.annotation, { shortcut: { value }});
    } else {
      delete (this.props.annotation.shortcut);
      newAnnotation = Object.assign({}, this.props.annotation);
    }
    this.props.onChange(newAnnotation);
  }

  render() {
    const options = this.props.workflow.tasks[this.props.task.unlinkedTask] ? this.props.workflow.tasks[this.props.task.unlinkedTask].answers : [];
    const active = this.props.annotation.shortcut ? this.props.annotation.shortcut.value : [];

    return (
      <div className="unlinked-shortcut">

        {options.map((answer, i) => {
          if (answer._key === undefined) { answer._key = Math.random(); }
          return (
            <p key={answer._key}>
              <label htmlFor={`shortcut-${i}`} className={`answer minor-button answer-button ${active.includes(i) ? 'active' : ''}`}>
                <small>
                  <strong>
                    <input id={`shortcut-${i}`} type="checkbox" checked={active.includes(i)} onChange={this.toggleShortcut.bind(this, i)} />
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
    value: []
  };
};

Shortcut.propTypes = {
  annotation: React.PropTypes.shape(
    {
      shortcut: React.PropTypes.object,
      task: React.PropTypes.string
    }
  ),
  onChange: React.PropTypes.func,
  task: React.PropTypes.shape(
    { unlinkedTask: React.PropTypes.string }
  ),
  workflow: React.PropTypes.shape(
    { tasks: React.PropTypes.object }
  )
};

Shortcut.defaultProps = {
  annotation: {
    task: null,
    value: null
  },
  onChange: () => {},
  task: {
    unlinkedTask: null
  },
  workflow: {
    tasks: {}
  }
};
