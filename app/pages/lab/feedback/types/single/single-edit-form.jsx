import React from 'react';
import Select from 'react-select';

const fieldDescriptions = {
  id: 'ID',
  defaultSuccessMessage: 'Default success message',
  defaultFailureMessage: 'Default failure message',
};

export default class SingleEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleUpdateState = this.handleUpdateState.bind(this);
    this.renderAnswerSelect = this.renderAnswerSelect.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.validate = this.validate.bind(this);
    this.state = {
      id: props.feedback.id || '',
      defaultSuccessMessage: props.feedback.defaultSuccessMessage || '',
      defaultFailureMessage: props.feedback.defaultFailureMessage || '',
      answerIndex: props.feedback.answerIndex || '',
      valid: props.feedback.valid || false
    };
  }

  render() {
    const inputFields = ['id', 'defaultSuccessMessage', 'defaultFailureMessage'];
    return (
      <div>
        <span className="form-label">Edit feedback</span>
        {inputFields.map(this.renderInput)}
        {this.renderAnswerSelect()}
        <button onClick={this.handleSave} disabled={!this.state.valid}>Save</button>
        <button onClick={this.handleCancel}>Cancel</button>
      </div>
    );
  }

  handleInputChange({ target }) {
    this.handleUpdateState(target.name, target.value)
  }

  handleSave() {
    this.props.onSubmit(this.state, this.props.index);
  }

  handleSelectChange(option) {
    this.handleUpdateState('answerIndex', option.value)
  };

  handleUpdateState(key, value) {
    const newFeedback = Object.assign({}, this.state);
    newFeedback[key] = value;
    newFeedback.valid = this.validate(newFeedback);
    this.setState(newFeedback);
  }

  renderAnswerSelect() {
    const options = this.props.task.answers.map((option, index) => ({
      label: option.label,
      value: index.toString()
    }));

    if (!this.props.task.required) {
      options.unshift({ label: 'No answer', value: '-1' })
    }

    const selected = (this.state.answerIndex)
      ? options.find(option => this.state.answerIndex === option.value).value
      : '';

    return (
      <label>
        <span>Select correct answer</span>
        <Select
          clearable={false}
          searchable={false}
          options={options}
          onChange={this.handleSelectChange}
          value={selected}
        />
      </label>
    );
  }

  renderInput(field) {
    return (
      <div key={field}>
        <label>
          <span>{fieldDescriptions[field]}</span>
          <input
            type="text"
            name={field}
            value={this.state[field]}
            onChange={this.handleInputChange}
            className="standard-input full"
          />
        </label>
      </div>
    );
  }

  validate(feedback) {
    const keys = ['id', 'defaultSuccessMessage', 'defaultFailureMessage', 'answerIndex'];
    return keys.every(key => (typeof feedback[key] === 'string') &&
      (feedback[key].length > 0));
  }
}

SingleEditForm.propTypes = {
  task: React.PropTypes.shape({
    answers: React.PropTypes.arrayOf(React.PropTypes.shape({
      option: React.PropTypes.string,
    })),
  }),
  index: React.PropTypes.number,
  onSubmit: React.PropTypes.func,
};
