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
      editSelect: null
    };

    this.updateSelects = this.updateSelects.bind(this);
    this.createDropdown = this.createDropdown.bind(this);
    this.editDropdown = this.editDropdown.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.deleteDropdown = this.deleteDropdown.bind(this);
  }

  getRelated(select, related = []) {
    const relatedSelects = this.props.task.selects.filter(relatedSelect => relatedSelect.condition === select.id);
    relatedSelects.forEach((relatedSelect) => {
      related.push(relatedSelect);
      this.getRelated(relatedSelect, related);
    });
    return related;
  }

  updateSelects(selects) {
    const changes = {};
    changes[`${this.props.taskPrefix}.selects`] = selects;
    this.props.workflow.update(changes).save();
  }

  createDropdown() {
    const conditionIndex = parseInt(this.condition.value, 10);
    const newSelect = {
      id: Math.random().toString(16).split('.')[1],
      title: 'new dropdown title',
      condition: this.props.task.selects[conditionIndex].id,
      options: {},
      required: false,
      allowCreate: true
    };
    return newSelect;
  }

  editDropdown(index) {
    if (index === 'create') {
      this.setState({ editSelect: this.createDropdown() });
    } else {
      this.setState({ editSelect: this.props.task.selects[index] });
    }
  }

  handleDeletedValues(deletedValues, selects) {
    const newSelects = selects.map((select) => {
      const newSelect = select;
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
        delete newSelect.options[deleteKey];
      });
      return newSelect;
    });
    return newSelects;
  }

  handleSave(newData) {
    let selects = this.props.task.selects;
    const { editSelect, deletedValues } = newData;

    const [oldSelect] = selects.filter(select => select.id === editSelect.id);
    const index = selects.indexOf(oldSelect);
    if (index > -1) {
      selects.splice(index, 1, editSelect);
    } else {
      selects.push(editSelect);
    }

    if (deletedValues.length) {
      selects = this.handleDeletedValues(deletedValues, selects);
    }

    this.updateSelects(selects);
    this.setState({ editSelect: null });
  }

  handleCancel() {
    this.setState({ editSelect: null });
  }

  deleteDropdown(index) {
    const selects = this.props.task.selects;
    const select = selects[index];
    const related = this.getRelated(select);
    related.push(select);
    const filteredSelects = selects.filter(filterSelect => related.indexOf(filterSelect) === -1);

    this.updateSelects(filteredSelects);
  }

  render() {
    const handleChange = handleInputChange.bind(this.props.workflow);

    const selects = this.props.task.selects;

    return (
      <div className="dropdown-editor">
        <div className="dropdown">

          <section>
            <div>
              <AutoSave resource={this.props.workflow}>
                <label>
                  <span className="form-label">Main text</span>
                  <br />
                  <textarea
                    name={`${this.props.taskPrefix}.instruction`}
                    value={this.props.task.instruction}
                    className="standard-input full"
                    onChange={handleChange}
                  />
                </label>
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
              onReorder={this.updateSelects}
              editDropdown={this.editDropdown}
              deleteDropdown={this.deleteDropdown}
            />
            <p>
              <button type="button" className="minor-button" onClick={() => this.editDropdown('create')}>
                <i className="fa fa-plus" />
                Add a Dropdown
              </button>
              <label>
                <span> Dependent On </span>
                <select
                  id="condition"
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

          {this.state.editSelect &&
            <Dialog required={true}>
              <DropdownDialog
                selects={selects}
                initialSelect={this.state.editSelect}
                related={this.getRelated(this.state.editSelect)}
                onSave={this.handleSave}
                onCancel={this.handleCancel}
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
    id: PropTypes.string,
    save: PropTypes.func,
    update: PropTypes.func
  })
};

DropdownEditor.defaultProps = {
  task: {},
  workflow: {}
};
