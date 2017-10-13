import React from 'react';
import Translate from 'react-translate-component';

const SubmitEmailForm = ({ user, onSubmit, onChange, disabled, inProgress, emailSuccess, emailError }) => {
  if (user) {
    return (
      <Translate
        content="resetPassword.loggedInDialog"
      />
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Translate
        component="p"
        content="resetPassword.enterEmailDialog"
      />
      <label>
        <input
          type="email"
          required={true}
          onChange={onChange}
          className="standard-input"
          size="50"
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

        {emailSuccess &&
          <i className="fa fa-check-circle form-help success" />}
      </p>

      {emailSuccess &&
        <Translate
          component="p"
          content="resetPassword.emailSuccess"
        />}

      {emailError &&
        <Translate
          className="form-help error"
          component="small"
          content="resetPassword.emailError"
        />}
    </form>
  );
}

export default SubmitEmailForm;
