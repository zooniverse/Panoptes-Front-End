import React from 'react';
import Translate from 'react-translate-component';

const NewPasswordForm = ({ onSubmit, disabled, inProgress, resetSuccess, resetError }) => (
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
        <Translate
          className="form-help error"
          component="small"
          content="resetPassword.resetError"
        />}
    </p>
  </form>
  );

NewPasswordForm.propTypes = {
  disabled: React.PropTypes.bool,
  inProgress: React.PropTypes.bool,
  onSubmit: React.PropTypes.func,
  resetError: React.PropTypes.string,
  resetSuccess: React.PropTypes.bool
};

NewPasswordForm.defaultProps = {
  disabled: null,
  inProgress: false,
  onSubmit: () => {},
  resetError: null,
  resetSuccess: null
};

export default NewPasswordForm;
