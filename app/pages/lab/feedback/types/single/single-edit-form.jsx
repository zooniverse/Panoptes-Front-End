import React from 'react';
import Select from 'react-select';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

counterpart.registerTranslations('en', {
  singleEditForm: {
    title: 'Edit Feedback',
    save: 'Save',
    cancel: 'Cancel',
    fields: {
      id: {
        title: 'ID',
        help: 'A unique field used to identify a feedback type.',
      },
      defaultSuccessMessage: {
        title: 'Default success message',
        help: 'The message to show to the volunteer when they make a correct classification. Can be overridden using subject metadata.',
      },
      defaultFailureMessage: {
        title: 'Default failure message',
        help: 'The message to show to the volunteer when they make an incorrect classification. Can be overridden using subject metadata.',
      },
      answer: {
        title: 'Select correct answer',
        help: 'The correct answer in the task for this feedback type.',
        noAnswer: 'No answer',
      },
    }
  }
});

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
      <div className="single-edit-feedback-modal">
        <Translate content="singleEditForm.title" className="form-label" />
        {inputFields.map(this.renderInput)}
        {this.renderAnswerSelect()}
        <div className="single-edit-feedback-modal__buttons">
          <button onClick={this.handleCancel} className="minor-button">
            <Translate content="singleEditForm.cancel" />
          </button>
          <button onClick={this.handleSave} disabled={!this.state.valid} className="major-button">
            <Translate content="singleEditForm.save" />
          </button>
        </div>
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
      options.unshift({
        label: counterpart('singleEditForm.fields.answer.noAnswer'),
        value: '-1',
      });
    }

    const selected = (this.state.answerIndex)
      ? options.find(option => this.state.answerIndex === option.value).value
      : '';

    return (
      <label>
        <div>
          <Translate content="singleEditForm.fields.answer.title" />
        </div>
        <small className="form-help">
            <Translate content="singleEditForm.fields.answer.help" />
          </small>
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
          <div>
            <Translate content={`singleEditForm.fields.${field}.title`} />
          </div>
          <small className="form-help">
            <Translate content={`singleEditForm.fields.${field}.help`} />
          </small>
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
