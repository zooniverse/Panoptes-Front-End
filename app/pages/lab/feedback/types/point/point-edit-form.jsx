import React from 'react';
import Select from 'react-select';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

counterpart.registerTranslations('en', {
  PointEditForm: {
    title: 'Edit Feedback - Point',
    save: 'Save',
    cancel: 'Cancel',
    fields: {
      id: {
        title: 'ID',
        help: 'A unique field used to identify a feedback type.',
      },
      tol: {
        title: 'Default tolerance',
        help: 'The radius around the point that counts as a correct classification. Can be overridden using subject metadata.',
      },
      defaultSuccessMessage: {
        title: 'Default success message',
        help: 'The message to show to the volunteer when they make a correct classification. Can be overridden using subject metadata.',
      },
      defaultFailureMessage: {
        title: 'Default failure message',
        help: 'The message to show to the volunteer when they make an incorrect classification. Can be overridden using subject metadata.',
      },
    }
  }
});

const fieldConfig = [
  {
    id: 'id'
  },
  {
    id: 'tol',
    type: 'number',
  },
  {
    id: 'defaultSuccessMessage',
  },
  {
    id: 'defaultFailureMessage',
  },
];

export default class PointEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleUpdateState = this.handleUpdateState.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.validate = this.validate.bind(this);
    this.state = {
      id: props.feedback.id || '',
      tol: props.feedback.tol || '',
      defaultSuccessMessage: props.feedback.defaultSuccessMessage || '',
      defaultFailureMessage: props.feedback.defaultFailureMessage || '',
      valid: props.feedback.valid || false
    };
  }

  render() {
    return (
      <div className="single-edit-feedback-modal">
        <Translate content="PointEditForm.title" className="form-label" />
        {fieldConfig.map(this.renderInput)}

        <div className="single-edit-feedback-modal__buttons">
          <button onClick={this.handleCancel} className="minor-button">
            <Translate content="PointEditForm.cancel" />
          </button>
          <button onClick={this.handleSave} disabled={!this.state.valid} className="major-button">
            <Translate content="PointEditForm.save" />
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

  renderInput(field) {
    return (
      <div key={field.id}>
        <label>
          <div>
            <Translate content={`PointEditForm.fields.${field.id}.title`} />
          </div>
          <small className="form-help">
            <Translate content={`PointEditForm.fields.${field.id}.help`} />
          </small>
          <input
            type={field.type || "text"}
            name={field.id}
            value={this.state[field.id]}
            onChange={this.handleInputChange}
            className="standard-input full"
          />
        </label>
      </div>
    );
  }

  validate(feedback) {
    const keys = fieldConfig.map(field => field.id);
    return keys.every(key => (typeof feedback[key] === 'string') &&
      (feedback[key].length > 0));
  }
}

PointEditForm.propTypes = {
  task: React.PropTypes.shape({
    answers: React.PropTypes.arrayOf(React.PropTypes.shape({
      option: React.PropTypes.string,
    })),
  }),
  index: React.PropTypes.number,
  onSubmit: React.PropTypes.func,
};
