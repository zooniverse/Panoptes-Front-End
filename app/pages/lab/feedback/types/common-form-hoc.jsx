import React, { Component, PropTypes } from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import merge from 'lodash/merge';
import CommonFormHOCButtons from './common-form-hoc-buttons';
import FeedbackInput from './feedback-input';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  feedbackEditForm: {
    title: 'Edit Feedback',
    fields: {
      id: {
        title: 'ID',
        help: 'A unique field used to identify a feedback type.'
      },
      successEnabled: {
        title: 'Enable positive feedback',
        help: 'Shows a feedback message to the user when they correctly identify a known subject.'
      },
      defaultSuccessMessage: {
        title: 'Default success message',
        help: 'The message to show to the volunteer when they make a correct classification. Can be overridden using subject metadata.'
      },
      failureEnabled: {
        title: 'Enable negative feedback',
        help: 'Shows a feedback message to the user when they incorrectly identify a known subject.'
      },
      defaultFailureMessage: {
        title: 'Default failure message',
        help: 'The message to show to the volunteer when they make an incorrect classification. Can be overridden using subject metadata.'
      }
    }
  }
});
/* eslint-enable max-len */

function returnCommonFormHOC(FeedbackTypeForm) {
  class CommonFormHOC extends Component {
    constructor(props) {
      super(props);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSave = this.handleSave.bind(this);
      this.handleUpdateState = this.handleUpdateState.bind(this);
      this.renderCommonFields = this.renderCommonFields.bind(this);
      this.validate = this.validate.bind(this);

      const { feedback } = props;
      this.state = {
        form: {
          id: feedback.id || '',
          successEnabled: (typeof feedback.successEnabled === 'boolean') ? feedback.successEnabled : true,
          defaultSuccessMessage: feedback.defaultSuccessMessage || '',
          failureEnabled: (typeof feedback.failureEnabled === 'boolean') ? feedback.failureEnabled : true,
          defaultFailureMessage: feedback.defaultFailureMessage || ''
        },
        validations: [
          // Must have an id
          form => (!!form.id),
          // Must have either success or failure or both enabled
          form => (!(!form.successEnabled && !form.failureEnabled)),
          // Success must be disabled, or enabled with a message
          form => (!form.successEnabled || (form.successEnabled &&
            form.defaultSuccessMessage && form.defaultSuccessMessage.length > 0)),
          // Failure must be disabled, or enabled with a message
          form => (!form.failureEnabled || (form.failureEnabled &&
            form.defaultFailureMessage && form.defaultFailureMessage.length > 0))
        ]
      };
    }

    handleInputChange({ target }) {
      this.handleUpdateState({
        form: {
          [target.name]: (target.type === 'checkbox') ? target.checked : target.value
        }
      });
    }

    handleSave() {
      this.props.onSubmit(this.state.form, this.props.index)
        .catch(error => console.error(error));
    }

    handleUpdateState(update) {
      const newState = merge({}, this.state, update);
      newState.form.valid = this.validate(newState);
      this.setState(newState);
    }

    validate(newState) {
      return this.state.validations.every(validation => validation(newState.form));
    }

    renderCommonFields() {
      const commonFields = [
        { id: 'id', type: 'text' },
        { id: 'successEnabled', type: 'checkbox' },
        { id: 'defaultSuccessMessage', type: 'text', disabled: (this.state.form.successEnabled !== true) },
        { id: 'failureEnabled', type: 'checkbox' },
        { id: 'defaultFailureMessage', type: 'text', disabled: (this.state.form.failureEnabled !== true) }
      ];

      return commonFields.map(field =>
        <FeedbackInput
          key={`feedback-input-${field.id}`}
          field={field}
          title={counterpart(`feedbackEditForm.fields.${field.id}.title`)}
          help={counterpart(`feedbackEditForm.fields.${field.id}.help`)}
          value={this.state.form[field.id]}
          onChange={this.handleInputChange.bind(this)}
        />
      );
    }

    render() {
      const newProps = {
        formState: this.state.form,
        updateState: this.handleUpdateState
      };

      return (
        <div className="edit-feedback-modal">
          <Translate className="form-label" content="feedbackEditForm.title" />
          {this.renderCommonFields()}
          <FeedbackTypeForm {...this.props} {...newProps} />
          <CommonFormHOCButtons
            disableSave={!this.state.form.valid}
            handleCancel={this.handleCancel}
            handleSave={this.handleSave}
          />
        </div>
      );
    }
  }

  CommonFormHOC.propTypes = {
    feedback: PropTypes.shape({
      id: PropTypes.string,
      successEnabled: PropTypes.bool,
      defaultSuccessMessage: PropTypes.string,
      failureEnabled: PropTypes.bool,
      defaultFailureMessage: PropTypes.string
    }),
    index: PropTypes.string,
    onSubmit: PropTypes.func
  };

  return CommonFormHOC;
}

export default returnCommonFormHOC;
