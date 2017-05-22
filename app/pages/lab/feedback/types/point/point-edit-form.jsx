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
      dud: {
        title: 'No markings',
        help: 'Check this box if there should be no annotations on this feedback type (also known as a dud).'
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

class PointEditForm extends React.Component {
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
      dud: props.feedback.dud || false,
      tol: props.feedback.tol || '',
      defaultSuccessMessage: props.feedback.defaultSuccessMessage || '',
      defaultFailureMessage: props.feedback.defaultFailureMessage || '',
      valid: props.feedback.valid || false
    };
  }

  render() {
    const fields = this.getFields()
    return (
      <div className="single-edit-feedback-modal">
        <Translate content="PointEditForm.title" className="form-label" />
        {fields.map(this.renderInput)}

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

  getFields() {
    const fields = [
      { id: 'id' },
      { id: 'dud', type: 'checkbox' },
      { id: 'defaultSuccessMessage' },
      { id: 'defaultFailureMessage' }
    ];

    if (this.state.dud === false) {
      fields.splice(2, 0, { id: 'tol', type: 'number' });
    }

    return fields;    
  }

  handleInputChange({ target }) {
    const args = [target.name, target.value];
    if (target.type === 'checkbox') {
      args.splice(1, 1, target.checked);
    }
    this.handleUpdateState.apply(this, args);
  }

  handleSave() {
    const stateCopy = Object.assign({}, this.state);
    if (stateCopy.dud && stateCopy.tol) {
      delete stateCopy.tol;
    }
    this.props.onSubmit(stateCopy, this.props.index);
  }

  handleSelectChange(option) {
    this.handleUpdateState('answerIndex', option.value);
  };

  handleUpdateState(key, value) {
    const newFeedback = Object.assign({}, this.state);
    newFeedback[key] = value;
    newFeedback.valid = this.validate(newFeedback);
    this.setState(newFeedback);
  }

  renderInput(field) {
    const inputProps = {
      type: field.type || 'text',
      name: field.id,
      onChange: this.handleInputChange.bind(this),
    };

    if (['text', 'number'].includes(inputProps.type)) {
      inputProps.className = 'standard-input full';
      inputProps.value = this.state[field.id];
    }

    if (field.type === 'checkbox') {
      inputProps.checked = this.state[field.id];
    }

    return (
      <div key={field.id}>
        <label>
          <div>
            <Translate content={`PointEditForm.fields.${field.id}.title`} />
          </div>
          <small className="form-help">
            <Translate content={`PointEditForm.fields.${field.id}.help`} />
          </small>
          <input {...inputProps} />
        </label>
      </div>
    );
  }

  validate({ id, defaultSuccessMessage, defaultFailureMessage, dud, tol }) {
    return [
      (id.length > 0),
      (defaultSuccessMessage.length > 0),
      (defaultFailureMessage.length > 0),
      (dud || (!dud && tol.length > 0))
    ].every(validation => validation);
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

export default PointEditForm;
