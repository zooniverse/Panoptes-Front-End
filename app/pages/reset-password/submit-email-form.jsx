import PropTypes from 'prop-types';
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
      <label>
        <Translate
          component="p"
          content="resetPassword.enterEmailLabel"
        />
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
      <p>
        <Translate
          component="small"
          content="resetPassword.missingEmailsSpamNote"
        />
      </p>
      <p>
        <Translate
          component="small"
          content="resetPassword.missingEmailsAlternateNote"
        />
      </p>
    </form>
  );
};

SubmitEmailForm.propTypes = {
  disabled: PropTypes.bool,
  emailError: PropTypes.string,
  emailSuccess: PropTypes.bool,
  inProgress: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  user: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

SubmitEmailForm.defaultProps = {
  disabled: null,
  emailError: null,
  emailSuccess: null,
  inProgress: false,
  onChange: () => {},
  onSubmit: () => {},
  user: null
};

export default SubmitEmailForm;
