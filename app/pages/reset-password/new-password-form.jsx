import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';

const NewPasswordForm = ({ onSubmit, disabled, inProgress, resetSuccess, resetError, minLength }) => (
  <form onSubmit={onSubmit}>
    <Translate
      component="p"
      content="resetPassword.newPasswordFormDialog"
    />
    <label>
      <Translate
        component="p"
        content="resetPassword.newPasswordFormLabel"
      />
      <input
        type="password"
        className="standard-input"
        size="20"
        required
        pattern={".{"+minLength+",}"}
        title={minLength+" characters minimum"}
        autoComplete="new-password"
      />
    </label>
    <label>
      <Translate
        component="p"
        content="resetPassword.newPasswordConfirmationLabel"
      />
      <input
        type="password"
        className="standard-input"
        size="20"
        required
        pattern={".{"+minLength+",}"}
        title={minLength+" characters minimum"}
        autoComplete="new-password"
      />
    </label>
    <p>
      <button
        type="submit"
        className="standard-button"
        disabled={disabled}
      >
        Submit
      </button>{' '}

      {inProgress &&
        <i className="fa fa-spinner fa-spin form-help" />}

      {resetSuccess &&
        <i className="fa fa-check-circle form-help success" />}

      {resetError &&
        <small className="form-help error">
          {resetError}
        </small>}
    </p>
  </form>
);

NewPasswordForm.propTypes = {
  disabled: PropTypes.bool,
  inProgress: PropTypes.bool,
  onSubmit: PropTypes.func,
  resetError: PropTypes.string,
  resetSuccess: PropTypes.bool,
  minLength: PropTypes.number
};

NewPasswordForm.defaultProps = {
  disabled: null,
  inProgress: false,
  onSubmit: () => {},
  resetError: null,
  resetSuccess: null,
  minLength: 8
};

export default NewPasswordForm;