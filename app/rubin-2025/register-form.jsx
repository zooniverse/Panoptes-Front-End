import counterpart from 'counterpart';
import React from 'react';
import PropTypes from 'prop-types';
import auth from 'panoptes-client/lib/auth';
import Translate from 'react-translate-component';
import LoadingIndicator from '../components/loading-indicator';
import debounce from 'debounce';

const REMOTE_CHECK_DELAY = 1000;
const MIN_PASSWORD_LENGTH = 8;

class RegisterForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      badNameChars: [],
      nameConflict: null,  // This is null when uninitialised, false if there's no name conflict, and an array if there's a conflict.
      passwordTooShort: false,
      passwordsDontMatch: false,
      emailConflict: null,  // This is null when uninitialised, false if there's no name conflict, and an array if there's a conflict.
      emailInvalidChars: false,
      emailInvalidFormat: false,
      agreeToPrivacyPolicy: false,
      error: null,
      underAge: false,

      input_login: '',
      input_password: '',
      input_confirmedPassword: '',
      input_email: '',
      input_creditedName: '',
      input_okayToEmail: true,
      input_betaTester: false,

      // part of mixins from promiseToSetState
      pending: {},
      rejected: {}
    };
    
    this.updateAge = this.updateAge.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.checkForLoginConflict = this.checkForLoginConflict.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.checkForEmailConflict = this.checkForEmailConflict.bind(this);
    this.handlePrivacyPolicyChange = this.handlePrivacyPolicyChange.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    
    this.debouncedCheckForLoginConflict = null;
    this.debouncedCheckForEmailConflict = null;

    // part of mixins from promiseToSetState
    this._promiseStateKeys = {};
  }

  render () {
    const {
      badNameChars,
      nameConflict,
      passwordTooShort,
      passwordsDontMatch,
      emailConflict,
      emailInvalidChars,
      emailInvalidFormat,
    } = this.state;

    const privacyPolicyLink = (
      <a target="_blank" href={`${window.location.origin}/privacy`}>
        <Translate content="registerForm.privacyPolicy" />
      </a>
    );
    
    const inputDisabled = !!this.props.user;
    const submitDisabled = !this.isFormValid() || Object.keys(this.state.pending).length !== 0 || (this.props.user != null)

    return (
      <form className="register-form" method="POST" onSubmit={this.handleSubmit}>
        
        <div className="form-row">
          <span className="checkbox-block">
            <input
              checked={this.state.underAge}
              disabled={inputDisabled}
              id="register-form-underAge"
              name="underAge"
              onChange={this.updateAge}
              type="checkbox"
            />
            <label htmlFor="register-form-underAge">
              <Translate component="span" content="registerForm.underAge" />
            </label>
          </span>
        </div>

        <div className="form-row">
          <div className="label-block">
            <label htmlFor="register-form-login">
              <Translate content="registerForm.userName" />
            </label>

            {badNameChars?.length > 0 && (
              <Translate className="form-help error" content="registerForm.badChars" />
            )}

            {"nameConflict" in this.state.pending && (
              <LoadingIndicator />
            )}

            {nameConflict && (
              <span className="form-help error">
                <Translate content="registerForm.nameConflict" />{' '}
                <a href={`${window.location.origin}/reset-password`}>
                  <Translate content="registerForm.forgotPassword" />
                </a>
              </span>
            )}

            {(this.state.input_login?.length > 0
              && nameConflict === false
            ) && (
              <span className="form-help success">
                <Translate content="registerForm.looksGood" />
              </span>
            )}

            <Translate className="form-help info right-align" content="registerForm.required" />
          </div>

          <input
            aria-describedby="register-form-error-message"
            className="standard-input full"
            disabled={inputDisabled}
            id="register-form-login"
            maxLength="255"
            name="login"
            onChange={this.handleUserInput}
            type="text"
            value={this.state.input_login}
          />

          <div>
            <Translate component="span" className="form-help info" content="registerForm.whyUserName" />
            {this.state.underAge && (
              <Translate component="span" className="form-help info" content="registerForm.notRealName" />
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="label-block">
            <label htmlFor="register-form-password">
              <Translate content="registerForm.password" />
            </label>
            {passwordTooShort && (
              <Translate className="form-help error" content="registerForm.passwordTooShort" />
            )}
            <Translate className="form-help info right-align" content="registerForm.required" />
          </div>
          <input
            aria-describedby="register-form-error-message"
            className="standard-input full"
            disabled={inputDisabled}
            id="register-form-password"
            name="password"
            onChange={this.handleUserInput}
            type="password"
            value={this.state.input_password}
          />
        </div>

        <div className="form-row">
          <div className="label-block">
            <label htmlFor="register-form-confirmedPassword">
              <Translate content="registerForm.confirmPassword" />
            </label>
            {passwordsDontMatch && (
              <Translate className="form-help error" content="registerForm.passwordsDontMatch" />
            )}
            {(this.state.input_password?.length > 0
              && this.state.input_confirmedPassword?.length > 0
              && !passwordsDontMatch
              && !passwordTooShort
            ) && (
              <Translate className="form-help success" content="registerForm.looksGood" />
            )}
            <Translate className="form-help info right-align" content="registerForm.required" />
          </div>
          <input
            className="standard-input full"
            disabled={inputDisabled}
            id="register-form-confirmedPassword"
            name="confirmedPassword"
            onChange={this.handleUserInput}
            type="password"
            value={this.state.input_confirmedPassword}
          />
        </div>

        <div className="form-row">
          <div className="label-block">
            <label htmlFor="register-form-email">
              {this.state.underAge
                ? <Translate content="registerForm.guardianEmail" />
                : <Translate content="registerForm.email" />
              }
            </label>

            {emailInvalidChars && (
              <Translate className="form-help error" content="registerForm.emailInvalidChars" />
            )}

            {(!emailInvalidChars && emailInvalidFormat) && (
              <Translate className="form-help info" content="registerForm.emailInvalidFormat" />
            )}

            {'emailConflict' in this.state.pending && (
              <LoadingIndicator />
            )}

            {emailConflict && (
              <span className="form-help error">
                <Translate content="registerForm.emailConflict" />{' '}
                <a href={`${window.location.origin}/reset-password`}>
                  <Translate content="registerForm.forgotPassword" />
                </a>
              </span>
            )}

            {(this.state.input_email?.length > 0
              && !emailConflict
              && !emailInvalidChars
              && !emailInvalidFormat
            ) && (
              <Translate className="form-help success" content="registerForm.looksGood" />
            )}

            <Translate className="form-help info right-align" content="registerForm.required" />
          </div>

          <input
            aria-describedby="register-form-error-message"
            className="standard-input full"
            disabled={inputDisabled}
            id="register-form-email"
            name="email"
            onChange={this.handleUserInput}
            type="text"
            value={this.state.input_email}
          />
        </div>

        <div className="form-row">
          <div className="label-block">
            <label htmlFor="register-form-creditedName">
              <Translate content="registerForm.realName" />
            </label>
            <Translate className="form-help info right-align" content="registerForm.optional" />
          </div>
          <input
            className="standard-input full"
            disabled={inputDisabled}
            id="register-form-creditedName"
            name="creditedName"
            onChange={this.handleUserInput}
            pattern='[^@]+'
            title={counterpart('registerForm.realNamePatternHelp')}
            type="text"
            value={this.state.input_creditedName}
          />
          <Translate component="span" className="form-help info" content="registerForm.whyRealName" />
        </div>

        <div className="form-row">
          <div className="checkbox-block">
            <input
              checked={!!this.state.agreeToPrivacyPolicy}
              disabled={inputDisabled}
              name="agreeToPrivacyPolicy"
              id="register-form-agreeToPrivacyPolicy"
              onChange={this.handlePrivacyPolicyChange}
              type="checkbox"
            />
            <label htmlFor="register-form-agreeToPrivacyPolicy">
              {this.state.underAge
                ? <Translate component="span" content="registerForm.underAgeConsent" link={privacyPolicyLink} />
                : <Translate component="span" content="registerForm.agreeToPrivacyPolicy" link={privacyPolicyLink} />
              }
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="checkbox-block">
            <input
              checked={this.state.input_okayToEmail}
              disabled={inputDisabled}
              name="okayToEmail"
              id="register-form-okayToEmail"
              onChange={this.handleUserInput}
              type="checkbox"
            />
            <label htmlFor="register-form-okayToEmail">
              {this.state.underAge
                ? <Translate component="span" content="registerForm.underAgeEmail" />
                : <Translate component="span" content="registerForm.okayToEmail" />
              }
            </label>
          </div>

          <div className="checkbox-block">
            <input
              checked={this.state.input_betaTester}
              disabled={inputDisabled}
              name="betaTester"
              id="register-form-betaTester"
              onChange={this.handleUserInput}
              type="checkbox"
            />
            <label htmlFor="register-form-betaTester">
              <Translate component="span" content="registerForm.betaTester" />
            </label>
          </div>
        </div>

        <div className="center-align">
          {'user' in this.state.pending && (
            <LoadingIndicator />
          )}

          {this.props.user && (
            <span className="form-help warning">
              <Translate content="registerForm.alreadySignedIn" name={this.props.user.login} />{' '}
              <button type="button" className="minor-button" onClick={this.handleSignOut}><Translate content="registerForm.signOut" /></button>
            </span>
          )}

          <div aria-live="polite">
            {this.state.error && (
              <div id="register-form-error-message" className="form-help error">
                <span>{this.state.error.toString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-row submit-row">
          <button
            type="submit"
            className="standard-button"
            disabled={submitDisabled}
          >
            <Translate content="registerForm.register" />
          </button>
        </div>
      </form>
    );
  }

  updateAge (e) {
    return this.setState({
      underAge: !!e.currentTarget?.checked
    });
  }

  handleUserInput (e) {
    const input = e?.currentTarget;
    const inputName = input.name;
    let inputValue = input.type === 'checkbox' ? !!input.checked : input.value;

    switch (inputName) {
      case "login":
        this.handleLoginChange(inputValue);
        break;
      case "password":
        this.handlePasswordChange(inputValue, this.state.input_confirmedPassword);
        break;
      case "confirmedPassword":
        this.handlePasswordChange(this.state.input_password, inputValue);
        break;
      case "email":
        inputValue = (inputValue || '').replaceAll(' ', '');  // Trim out empty spaces
        this.handleEmailChange(inputValue);
        break;
    }

    this.setState({
      [`input_${inputName}`]: inputValue
    });
  }

  handleLoginChange (login) {
    var badChars, char, exists;
    exists = login.length !== 0;
    badChars = (function() {
      var i, len, ref, results;
      ref = login.split('');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        char = ref[i];
        if (char.match(/[\w\-\'\.]/) === null) {
          results.push(char);
        }
      }
      return results;
    })();
    this.setState({
      badNameChars: badChars,
      nameConflict: null,
      nameExists: exists
    });
    if (exists && badChars.length === 0) {
      if (this.debouncedCheckForLoginConflict == null) {
        this.debouncedCheckForLoginConflict = debounce(this.checkForLoginConflict, REMOTE_CHECK_DELAY);
      }
      return this.debouncedCheckForLoginConflict(login);
    }
  }

  checkForLoginConflict (username) {
    return this.promiseToSetState({
      nameConflict: auth.register({
        login: username
      }).catch(function(error) {
        return error.message.match(/login(.+)taken/mi) || false;
      })
    });
  }

  handlePasswordChange (password, confirmedPassword) {
    const passwordNotEmpty = password.length > 0;
    const bothNotEmpty = password.length > 0 && confirmedPassword.length > 0;
    const longEnough = password.length >= MIN_PASSWORD_LENGTH;
    const matches = password === confirmedPassword;

    return this.setState({
      passwordTooShort: passwordNotEmpty && !longEnough,
      passwordsDontMatch: bothNotEmpty && !matches
    });
  }

  handleEmailChange (email) {
    this.promiseToSetState({
      emailConflict: Promise.resolve(null) // Cancel any existing request.
    });

    // Sanity check for emails
    // We're VERY LOOSE with our checks here, as it's better to admit an invalid email than to block a valid email we didn't correctly anticipate.
    const emailInvalidChars = /[,\\\/]+/g.test(email);  // Does the email contain invalid characters? Mostly, this catches the common "comma instead of period" error.
    const emailInvalidFormat = email?.length > 0 && !(/.+@.+\..+/).test(email);  // Does the email at least look SORTA like a proper email address?
    this.setState({
      emailInvalidChars,
      emailInvalidFormat
    });

    if (email.match(/.+@.+\..+/)) {
      if (this.debouncedCheckForEmailConflict == null) {
        this.debouncedCheckForEmailConflict = debounce(this.checkForEmailConflict, REMOTE_CHECK_DELAY);
      }
      return this.debouncedCheckForEmailConflict(email);
    }
  }

  checkForEmailConflict (email) {
    return this.promiseToSetState({
      emailConflict: auth.register({email}).catch(function(error) {
        var ref;
        return (ref = error.message.match(/email(.+)taken/mi)) != null ? ref : false;
      })
    });
  }

  handlePrivacyPolicyChange (e) {
    return this.setState({
      agreeToPrivacyPolicy: !!e.currentTarget?.checked
    });
  }

  isFormValid () {
    const {
      badNameChars,
      nameConflict,
      passwordsDontMatch,
      emailConflict,
      emailInvalidChars,
      emailInvalidFormat,
      agreeToPrivacyPolicy,
      nameExists
    } = this.state;
    return (
      !(badNameChars?.length > 0)
      && !nameConflict
      && !passwordsDontMatch
      && !emailConflict
      && !emailInvalidChars
      && !emailInvalidFormat
      && nameExists
      && agreeToPrivacyPolicy
    );
  }

  handleSubmit (e) {
    e.preventDefault();

    const login = this.state.input_login;
    const password = this.state.input_password;
    const email = this.state.input_email;
    const credited_name = this.state.input_creditedName;
    const global_email_communication = this.state.input_okayToEmail;
    const project_email_communication = global_email_communication;
    const beta_email_communication = this.state.input_betaTester;
    
    const project_id = this.props.project?.id || undefined;

    this.setState({
      error: null
    });

    this.props.onSubmit?.();

    return auth.register({
      login,
      password,
      email,
      credited_name,
      project_email_communication,
      global_email_communication,
      project_id,
      beta_email_communication
    }).then((user) => {
      return this.props.onSuccess?.(user);

    }).catch((error) => {
      this.setState({error});
      return this.props.onFailure?.(error);
    });
  }

  handleSignOut () {
    return auth.signOut();
  }

  // part of mixins from promiseToSetState
  promiseToSetState (keysAndPromises, callback) {
    var handledPromise, key, pending, promise, promiseHandler, rejected;
    ({pending, rejected} = this.state);
    for (key in keysAndPromises) {
      promise = keysAndPromises[key];
      this._promiseStateKeys[key] = promise;
      promiseHandler = this._handlePromisedState.bind(this, key, promise);
      handledPromise = promise.then(promiseHandler.bind(this, false)).catch(promiseHandler.bind(this, true));
      pending[key] = handledPromise;
      delete rejected[key];
    }
    return this.setState({pending, rejected}, callback);
  }

  // part of mixins from promiseToSetState
  _handlePromisedState (key, promise, caught, value) {
    var isLatestPromise, newState, pending, rejected;
    // Only change the state if its current value is the same promise that's resolving.
    isLatestPromise = promise === this._promiseStateKeys[key];
    if (this.isMounted() && isLatestPromise) {
      ({pending, rejected} = this.state);
      newState = {pending, rejected};
      delete pending[key];
      if (caught) {
        newState[key] = null;
        rejected[key] = value;
      } else {
        newState[key] = value;
        delete rejected[key];
      }
      this.setState(newState);
      return null;
    }
  }

  // part of mixins from promiseToSetState
  isMounted () { return true }
}

RegisterForm.propTypes = {
  onFailure: PropTypes.func,
  onSubmit: PropTypes.func,
  onSuccess: PropTypes.func,
  user: PropTypes.object
};

export { RegisterForm };
