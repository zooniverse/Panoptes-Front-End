import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';
import Shortcut from './';

export default class ShortcutEditor extends React.Component {
  constructor(props) {
    super(props);
    this.addAnswer = this.addAnswer.bind(this);
    this.toggleShortcut = this.toggleShortcut.bind(this);
  }

  toggleShortcut(e) {
    let nextTaskID;

    if (e.target.checked) {
      const taskCount = Object.keys(this.props.workflow.tasks).length;

      let taskIDNumber = -1;

      while (!((nextTaskID != null) && !(nextTaskID in this.props.workflow.tasks))) {
        taskIDNumber += 1;
        nextTaskID = `T${taskCount + taskIDNumber}`;
      }

      const changes = {};
      changes[`tasks.${nextTaskID}`] = Shortcut.getDefaultTask(this.props.task.question);

      this.props.task.unlinkedTask = nextTaskID;
      this.props.workflow.update(changes);
      this.addAnswer();
    } else {
      delete this.props.workflow.tasks[this.props.task.unlinkedTask];
      delete this.props.task.unlinkedTask;
      this.props.workflow.update('tasks');
    }
  }

  addAnswer() {
    this.props.workflow.tasks[this.props.task.unlinkedTask].answers.push({ label: 'Nothing Here' });
    this.props.workflow.update('tasks');
  }

  removeChoice(index) {
    if (this.props.task) {
      const answers = this.props.workflow.tasks[this.props.task.unlinkedTask].answers;
      answers.splice(index, 1);
      if (answers.length === 0) {
        delete this.props.workflow.tasks[this.props.task.unlinkedTask];
        delete this.props.task.unlinkedTask;
      }
    }
    this.props.workflow.update('tasks');
  }

  render() {
    let shortcuts;
    if (this.props.task) {
      shortcuts = this.props.workflow.tasks[this.props.task.unlinkedTask];
    }
    const handleChange = handleInputChange.bind(this.props.workflow);
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child);
    });

    return (
      <div>

        {children}
        <hr />

        <label htmlFor="shortcut" title="Shortcut Options to End Classification">
          <AutoSave resource={this.props.workflow}>
            <span className="form-label">Shortcut Option</span>{' '}
            <input id="shortcut" type="checkbox" checked={shortcuts !== undefined} onChange={this.toggleShortcut} />
          </AutoSave>
        </label>

        <br />

        <small className="form-help">
          Give volunteers the choice to skip to the end
          of a classification if one of the following options is selected.
        </small>

        {shortcuts && (
          <div className="workflow-task-editor-choices">
            {shortcuts.answers.map((shortcut, index) => {
              if (shortcut._key === undefined) { shortcut._key = Math.random(); }
              return (
                <div key={shortcut._key} className="workflow-choice-editor">
                  <AutoSave resource={this.props.workflow}>
                    <textarea name={`tasks.${this.props.task.unlinkedTask}.answers.${index}.label`} value={shortcut.label} onChange={handleChange} />
                  </AutoSave>

                  <AutoSave resource={this.props.workflow}>
                    <button type="button" className="workflow-choice-remove-button" title="Remove choice" onClick={this.removeChoice.bind(this, index)}>&times;</button>
                  </AutoSave>
                </div>
              );
            })}

            <AutoSave resource={this.props.workflow}>
              <button type="button" className="workflow-choice-add-button" title="Add Shortcut" onClick={this.addAnswer}>+</button>
            </AutoSave>

            </div>)}

        {' '}
      </div>

    );
  }

}

ShortcutEditor.propTypes = {
  children: PropTypes.node,
  task: PropTypes.shape(
    {
      question: PropTypes.string,
      unlinkedTask: PropTypes.string
    }
  ),
  workflow: PropTypes.shape(
    {
      tasks: PropTypes.object,
      update: PropTypes.func
    }
  )
};

ShortcutEditor.defaultProps = {
  task: { },
  workflow: { }
};