import React from 'react';
import Translate from 'react-translate-component';

const NewPasswordForm = ({ onSubmit, disabled, inProgress, resetSuccess, resetError }) => {
  return (
    <form onSubmit={onSubmit}>
      <Translate
        component="p"
        content="resetPassword.newPasswordFormDialog"
      />
      <Translate
        component="p"
        content="resetPassword.newPasswordFormLabel"
      />
      <label>
        <input
          type="password"
          className="standard-input"
          size="20"
        />
      </label>
      <Translate
        component="p"
        content="resetPassword.newPasswordConfirmationLabel"
      />
      <label>
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
}

export default NewPasswordForm;


