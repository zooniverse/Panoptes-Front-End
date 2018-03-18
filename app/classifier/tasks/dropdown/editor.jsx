import PropTypes from 'prop-types';
import React from 'react';
import { MarkdownEditor, MarkdownHelp } from 'markdownz';
import Dialog from 'modal-form/dialog';
import AutoSave from '../../../components/auto-save';
import alert from '../../../lib/alert';
import handleInputChange from '../../../lib/handle-input-change';
import NextTaskSelector from '../next-task-selector';

import DropdownList from './dropdown-list';
import DropdownDialog from './dropdown-dialog';

export default class DropdownEditor extends React.Component {
  constructor(props) {
    super(props);

    this.condition = null;

    this.state = {
      editing: null
    };

    this.createDropdown = this.createDropdown.bind(this);
    this.onReorder = this.onReorder.bind(this);
    this.editDropdown = this.editDropdown.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.deleteDropdown = this.deleteDropdown.bind(this);
  }

  onReorder(newSelects) {
    this.props.task.selects = newSelects;
    this.updateTasks();
  }

  getRelated(select, related = []) {
    const relatedSelects = this.props.task.selects.filter(relatedSelect => relatedSelect.condition === select.id);
    relatedSelects.forEach((relatedSelect) => {
      related.push(relatedSelect);
      this.getRelated(relatedSelect, related);
    });
    return related;
  }

  updateTasks() {
    this.props.workflow.update('tasks');
    this.props.workflow.save();
  }

  createDropdown() {
    const conditionIndex = parseInt(this.condition.value, 10);
    const selects = this.props.task.selects;
    selects.splice((conditionIndex + 1), 0, {
      id: Math.random().toString(16).split('.')[1],
      title: 'new dropdown title',
      condition: this.props.task.selects[conditionIndex].id,
      options: {},
      required: false,
      allowCreate: true
    });
    this.editDropdown(conditionIndex + 1);
  }

  editDropdown(index) {
    this.setState({ editing: index });
  }

  handleDeletedValues(deletedValues) {
    this.props.task.selects.forEach((select) => {
      const deleteKeys = [];
      const optionsKeys = Object.keys(select.options);
      optionsKeys.forEach((optionsKey) => {
        const arrayOfValues = optionsKey.split(';');
        deletedValues.forEach((value) => {
          if (arrayOfValues.indexOf(value) !== -1) {
            deleteKeys.push(optionsKey);
          }
        });
      });
      deleteKeys.forEach((deleteKey) => {
        delete select.options[deleteKey];
      });
    });
  }

  handleSave(newData) {
    const { editSelect, deletedValues } = newData;

    this.props.task.selects[this.state.editing] = editSelect;

    if (deletedValues.length) {
      this.handleDeletedValues(deletedValues);
    }

    this.editDropdown(null);
    this.updateTasks();
  }

  deleteDropdown(index) {
    const select = this.props.task.selects[index];
    const related = this.getRelated(select);
    related.push(select);
    const filteredSelects = this.props.task.selects.filter(filteredSelect => related.indexOf(filteredSelect) === -1);
    this.props.task.selects = filteredSelects;
    this.updateTasks();
  }

  render() {
    const handleChange = handleInputChange.bind(this.props.workflow);

    const { selects } = this.props.task;
    let select = null;
    if (selects[this.state.editing]) {
      select = selects[this.state.editing];
    }

    return (
      <div className="dropdown-editor">
        <div className="dropdown">

          <section>
            <div>
              <AutoSave resource={this.props.workflow}>
                <span className="form-label">Main text</span>
                <br />
                <textarea
                  name={`${this.props.taskPrefix}.instruction`}
                  value={this.props.task.instruction}
                  className="standard-input full"
                  onChange={handleChange}
                />
              </AutoSave>
              <small className="form-help">
                `Describe the task, or ask the question, in a way that is clear to a non-expert.
                If the task main text is the same as the dropdown title, only the main text will be displayed.
                You can use markdown to format this text.`
              </small>
              <br />
            </div>
            <br />
            <div>
              <AutoSave resource={this.props.workflow}>
                <span className="form-label">Help text</span>
                <br />
                <MarkdownEditor
                  name={`${this.props.taskPrefix}.help`}
                  value={this.props.task.help || ''}
                  rows="4"
                  className="full"
                  onChange={handleChange}
                  onHelp={() => alert(<MarkdownHelp />)}
                />
              </AutoSave>
              <small className="form-help">Add text and images for a help window.</small>
            </div>
            <hr />
          </section>

          <section>
            <h2 className="form-label">Dropdowns</h2>
            <DropdownList
              selects={selects}
              onReorder={this.onReorder}
              editDropdown={this.editDropdown}
              deleteDropdown={this.deleteDropdown}
            />
            <p>
              <button type="button" className="minor-button" onClick={this.createDropdown}>
                <i className="fa fa-plus" />
                Add a Dropdown
              </button>
              <label htmlFor="condition">
                <span> Dependent On </span>
                <select
                  id="condition"
                  key={this.state.editing}
                  ref={(node) => { this.condition = node; }}
                  defaultValue={`${selects.length - 1}`}
                >
                  {selects.map((selectOption, i) => (
                    <option key={selectOption.id} value={i}>{selectOption.title}</option>
                  ))}
                </select>
              </label>
              <br />

            </p>
          </section>

          {(this.state.editing !== null) &&
            <Dialog required={true}>
              <DropdownDialog
                selects={selects}
                initialSelect={select}
                related={this.getRelated(select)}
                onSave={this.handleSave}
                onCancel={this.editDropdown.bind(this, null)}
              />
            </Dialog>}

          <hr />
        </div>

        <AutoSave resource={this.props.workflow}>
          <span className="form-label">Next task</span>
          <br />
          <NextTaskSelector
            workflow={this.props.workflow}
            name={`${this.props.taskPrefix}.next`}
            value={this.props.task.next || ''}
            onChange={handleInputChange.bind(this.props.workflow)}
          />
        </AutoSave>

      </div>);
  }
}

DropdownEditor.propTypes = {
  task: PropTypes.shape({
    help: PropTypes.string,
    instruction: PropTypes.string,
    next: PropTypes.string,
    selects: PropTypes.array,
    type: PropTypes.string
  }),
  taskPrefix: PropTypes.string,
  workflow: PropTypes.shape({
    id: PropTypes.string
  })
};

DropdownEditor.defaultProps = {
  task: {},
  workflow: {}
};
