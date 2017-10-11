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
    </form>
  );
};

SubmitEmailForm.propTypes = {
  disabled: React.PropTypes.bool,
  emailError: React.PropTypes.string,
  emailSuccess: React.PropTypes.bool,
  inProgress: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
  user: React.PropTypes.object // eslint-disable-line react/forbid-prop-types
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
