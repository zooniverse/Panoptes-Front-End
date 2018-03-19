import PropTypes from 'prop-types';
import React from 'react';
import Summary from './summary';

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
    const { annotation, task, translation, workflow } = this.props;
    const options = workflow.tasks[task.unlinkedTask] ? workflow.tasks[task.unlinkedTask].answers : [];
    const active = annotation.shortcut ? annotation.shortcut.value : [];

    return (
      <div className="unlinked-shortcut">

        {options.map((answer, i) => {
          if (answer._key === undefined) { answer._key = Math.random(); }
          return (
            <p key={answer._key}>
              <label htmlFor={`shortcut-${i}`} className={`answer answer-button ${active.includes(i) ? 'active' : ''}`}>
                <small>
                  <strong>
                    <input id={`shortcut-${i}`} type="checkbox" checked={active.includes(i)} onChange={this.toggleShortcut.bind(this, i)} />
                    {' '}{translation.answers[i].label}
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

Shortcut.getTaskText = (task) => {
  return task.question;
};

Shortcut.getDefaultAnnotation = () => {
  return {
    _key: Math.random(),
    value: []
  };
};

Shortcut.propTypes = {
  annotation: PropTypes.shape(
    {
      shortcut: PropTypes.object,
      task: PropTypes.string
    }
  ),
  onChange: PropTypes.func,
  task: PropTypes.shape(
    { unlinkedTask: PropTypes.string }
  ),
  translation: PropTypes.shape({
    answers: PropTypes.array
  }),
  workflow: PropTypes.shape(
    { tasks: PropTypes.object }
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
  translation: {
    answers: []
  },
  workflow: {
    tasks: {}
  }
};