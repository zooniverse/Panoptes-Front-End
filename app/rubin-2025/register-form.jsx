import counterpart from 'counterpart';
import React from 'react';
import PropTypes from 'prop-types';
import auth from 'panoptes-client/lib/auth';
import Translate from 'react-translate-component';
import LoadingIndicator from '../components/loading-indicator';
import debounce from 'debounce';

const REMOTE_CHECK_DELAY = 1000;
const MIN_PASSWORD_LENGTH = 8;

counterpart.registerTranslations('en', {
  registerForm: {
    required: 'Required',
    optional: 'Optional',
    looksGood: 'Looks good',
    userName: 'User name',
    whyUserName: 'You’ll use this name to log in. It will be shown publicly. ',
    badChars: "Only letters, numbers, '.', '_', and '-'.",
    nameConflict: 'That username is taken',
    forgotPassword: 'Forgot my password',
    password: 'Password',
    passwordTooShort: 'Must be at least 8 characters',
    confirmPassword: 'Confirm password',
    passwordsDontMatch: 'These don’t match',
    email: 'Email address',
    emailConflict: 'An account with this address already exists',
    realName: 'Real name',
    realNamePatternHelp: "Enter a name, not an email address",
    whyRealName: 'We’ll use this to give you credit in scientific papers, posters, etc',
    agreeToPrivacyPolicy: 'You agree to our %(link)s (required)',
    privacyPolicy: 'privacy policy',
    okayToEmail: 'It’s okay to send me email every once in a while. (optional)',
    betaTester: 'I’d like to help test new projects, and be emailed when they’re available. (optional)',
    underAge: 'If you are under 16 years old, tick this box and complete the form with your parent/guardian.',
    notRealName: 'Don’t use your real name.',
    guardianEmail: 'Parent/Guardian’s email address',
    underAgeConsent: 'I confirm I am the parent/guardian and give permission for my child to register by providing my email address as the main contact address. Both I and my child understand and agree to the %(link)s (required)',
    underAgeEmail: 'If you agree, we will periodically send email promoting new research-related projects or other information relating to our research. We will not use your contact information for commercial purposes. (optional)',
    register: 'Register',
    alreadySignedIn: 'Signed in as %(name)s',
    signOut: 'Sign out'
  }
});

class RegisterForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      badNameChars: null,
      nameConflict: null,
      passwordTooShort: null,
      passwordsDontMatch: null,
      emailConflict: null,
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
      emailConflict
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
        
        <label className="form-separator">
          <input
            type="checkbox"
            checked={this.state.underAge}
            disabled={inputDisabled}
            onChange={this.updateAge}
          />
          <Translate component="span" content="registerForm.underAge" />
        </label>

        <label>
          <span className="columns-container inline spread">
            <Translate content="registerForm.userName" />
            {(badNameChars != null ? badNameChars.length : void 0) > 0 ? <Translate className="form-help error" content="registerForm.badChars" /> : "nameConflict" in this.state.pending ? <LoadingIndicator /> : nameConflict != null ? nameConflict ? <span className="form-help error">
                  <Translate content="registerForm.nameConflict" />{' '}
                  <a href={`${window.location.origin}/reset-password`} onClick={this.props.onSuccess}>
                    <Translate content="registerForm.forgotPassword" />
                  </a>
                </span> : <span className="form-help success">
                  <Translate content="registerForm.looksGood" />
                </span> : void 0
            }
            <Translate className="form-help info right-align" content="registerForm.required" />
          </span>
          <input
            type="text"
            name="login"
            id="register-form-login"
            value={this.state.input_login}
            className="standard-input full"
            disabled={inputDisabled}
            autoFocus
            onChange={this.handleUserInput}
            maxLength="255"
          />
          <Translate component="span" className="form-help info" content="registerForm.whyUserName" />
          {this.state.underAge && (
            <Translate component="span" className="form-help info" content="registerForm.notRealName" />
          )}
        </label>

        <br />

        <label>
          <span className="columns-container inline spread">
            <Translate content="registerForm.password" />
            {passwordTooShort && (
              <Translate className="form-help error" content="registerForm.passwordTooShort" />
            )}
            <Translate className="form-help info right-align" content="registerForm.required" />
          </span>
          <input
            type="password"
            name="password"
            id="register-form-password"
            value={this.state.input_password}
            className="standard-input full"
            disabled={inputDisabled}
            onChange={this.handleUserInput}
          />
        </label>

        <br />

        <label>
          <span className="columns-container inline spread">
            <Translate content="registerForm.confirmPassword" /><br />
            {passwordsDontMatch != null ? passwordsDontMatch ? <Translate className="form-help error" content="registerForm.passwordsDontMatch" /> : !passwordTooShort ? <Translate className="form-help success" content="registerForm.looksGood" /> : void 0 : void 0}
            <Translate className="form-help info right-align" content="registerForm.required" />
          </span>
          <input
            type="password"
            name="confirmedPassword"
            id="register-form-confirmedPassword"
            value={this.state.input_confirmedPassword}
            className="standard-input full"
            disabled={inputDisabled}
            onChange={this.handleUserInput}
          />
        </label>

        <br />

        <label>
          <span className="columns-container inline spread">
            {this.state.underAge ? <Translate content="registerForm.guardianEmail" /> : <Translate content="registerForm.email" />}
            {'emailConflict' in this.state.pending ? <LoadingIndicator /> : emailConflict != null ? emailConflict ? <span className="form-help error">
                  <Translate content="registerForm.emailConflict" />{' '}
                  <a href={`${window.location.origin}/reset-password`} onClick={this.props.onSuccess}>
                    <Translate content="registerForm.forgotPassword" />
                  </a>
                </span> : <Translate className="form-help success" content="registerForm.looksGood" /> : <Translate className="form-help info right-align" content="registerForm.required" />}
          </span>
          <input
            type="text"
            name="email"
            id="register-form-email"
            value={this.state.input_email}
            className="standard-input full"
            disabled={inputDisabled}
            onChange={this.handleUserInput}
          />
        </label>

        <br />

        <label>
          <span className="columns-container inline spread">
            <Translate content="registerForm.realName" />
            <Translate className="form-help info right-align" content="registerForm.optional" />
          </span>
          <input
            type="text"
            pattern='[^@]+'
            name="creditedName"
            id="register-form-creditedName"
            value={this.state.input_creditedName}
            className="standard-input full"
            disabled={inputDisabled}
            title={counterpart('registerForm.realNamePatternHelp')}
            onChange={this.handleUserInput}
          />
          <Translate component="span" className="form-help info" content="registerForm.whyRealName" />
        </label>

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            disabled={inputDisabled}
            checked={!!this.state.agreeToPrivacyPolicy}
            onChange={this.handlePrivacyPolicyChange}
          />
          {this.state.underAge ? <Translate component="span" content="registerForm.underAgeConsent" link={privacyPolicyLink} /> : <Translate component="span" content="registerForm.agreeToPrivacyPolicy" link={privacyPolicyLink} />}
        </label>

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            name="okayToEmail"
            id="register-form-okayToEmail"
            checked={this.state.input_okayToEmail}
            disabled={inputDisabled}
            onChange={this.handleUserInput}
          />
          {this.state.underAge ? <Translate component="span" content="registerForm.underAgeEmail" /> : <Translate component="span" content="registerForm.okayToEmail" />}
        </label><br />

        <label>
          <input
            type="checkbox"
            name="betaTester"
            id="register-form-betaTester"
            checked={this.state.input_betaTester}
            disabled={inputDisabled}
            onChange={this.handleUserInput}
          />
          <Translate component="span" content="registerForm.betaTester" />
        </label><br />

        <p style={{ textAlign: 'center' }}>
          {'user' in this.state.pending ? <LoadingIndicator /> : this.props.user != null ? <span className="form-help warning">
              <Translate content="registerForm.alreadySignedIn" name={this.props.user.login} />{' '}
              <button type="button" className="minor-button" onClick={this.handleSignOut}><Translate content="registerForm.signOut" /></button>
            </span> : this.state.error != null ? <span className="form-help error">{this.state.error.toString()}</span> : <span>&nbsp;</span>}
        </p>

        <div>
          <button
            type="submit"
            className="standard-button full"
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
    const inputValue = input.type === 'checkbox' ? !!input.checked : input.value;

    this.setState({
      [`input_${inputName}`]: inputValue
    })

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
        this.handleEmailChange(inputValue);
        break;
    }

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
    var asLong, exists, longEnough, matches;
    exists = password.length !== 0;
    longEnough = password.length >= MIN_PASSWORD_LENGTH;
    asLong = confirmedPassword.length >= password.length;
    matches = password === confirmedPassword;
    return this.setState({
      passwordTooShort: exists ? !longEnough : void 0,
      passwordsDontMatch: exists && asLong ? !matches : void 0
    });
  }

  handleEmailChange (email) {
    this.promiseToSetState({
      emailConflict: Promise.resolve(null) // Cancel any existing request.
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
      agreeToPrivacyPolicy,
      nameExists
    } = this.state;
    return (
      !(badNameChars?.length > 0)
      && !nameConflict
      && !passwordsDontMatch
      && !emailConflict
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

export { RegisterForm }
