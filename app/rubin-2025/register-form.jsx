import counterpart from 'counterpart';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass  from 'create-react-class';
import PromiseToSetState  from '../lib/promise-to-set-state';
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

module.exports = createReactClass({
  displayName: 'RegisterForm',
  mixins: [PromiseToSetState],
  getDefaultProps: function() {
    return {
      project: {}
    };
  },
  getInitialState: function() {
    return {
      badNameChars: null,
      nameConflict: null,
      passwordTooShort: null,
      passwordsDontMatch: null,
      emailConflict: null,
      agreedToPrivacyPolicy: null,
      error: null,
      underAge: false
    };
  },
  propTypes: {
    onFailure: PropTypes.func,
    onSubmit: PropTypes.func,
    onSuccess: PropTypes.func,
    user: PropTypes.object
  },
  contextTypes: {
    geordi: PropTypes.object
  },
  render: function() {
    var badNameChars, emailConflict, nameConflict, passwordTooShort, passwordsDontMatch, privacyPolicyLink;
    ({badNameChars, nameConflict, passwordTooShort, passwordsDontMatch, emailConflict} = this.state);
    return <form method="POST" onSubmit={this.handleSubmit}>
      <label className="form-separator">
        <input type="checkbox" ref="underAge" checked={this.state.underAge} disabled={this.props.user != null} onChange={this.updateAge} />
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
              </span> : void 0}
          <Translate className="form-help info right-align" content="registerForm.required" />
        </span>
        <input type="text" ref="name" className="standard-input full" disabled={this.props.user != null} autoFocus onChange={this.handleNameChange} maxLength="255" />
        <Translate component="span" className="form-help info" content="registerForm.whyUserName" />
        {this.state.underAge ? <Translate component="span" className="form-help info" content="registerForm.notRealName" /> : void 0}
      </label>

      <br />

      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.password" />
          {passwordTooShort ? <Translate className="form-help error" content="registerForm.passwordTooShort" /> : void 0}
          <Translate className="form-help info right-align" content="registerForm.required" />
        </span>
        <input type="password" ref="password" className="standard-input full" disabled={this.props.user != null} onChange={this.handlePasswordChange} />
      </label>

      <br />

      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.confirmPassword" /><br />
          {passwordsDontMatch != null ? passwordsDontMatch ? <Translate className="form-help error" content="registerForm.passwordsDontMatch" /> : !passwordTooShort ? <Translate className="form-help success" content="registerForm.looksGood" /> : void 0 : void 0}
          <Translate className="form-help info right-align" content="registerForm.required" />
        </span>
        <input type="password" ref="confirmedPassword" className="standard-input full" disabled={this.state.props != null} onChange={this.handlePasswordChange} />
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
        <input type="text" ref="email" className="standard-input full" disabled={this.state.props != null} onChange={this.handleEmailChange} />
      </label>

      <br />

      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.realName" />
          <Translate className="form-help info right-align" content="registerForm.optional" />
        </span>
        <input type="text" pattern='[^@]+' ref="realName" className="standard-input full" disabled={this.props.user != null} title={counterpart('registerForm.realNamePatternHelp')} />
        <Translate component="span" className="form-help info" content="registerForm.whyRealName" />
      </label>

      <br />
      <br />

      <label>
        <input type="checkbox" ref="agreesToPrivacyPolicy" disabled={this.props.user != null} onChange={this.handlePrivacyPolicyChange} />
        {privacyPolicyLink = <a target="_blank" href={`${window.location.origin}/privacy`}><Translate content="registerForm.privacyPolicy" /></a>}
        {this.state.underAge ? <Translate component="span" content="registerForm.underAgeConsent" link={privacyPolicyLink} /> : <Translate component="span" content="registerForm.agreeToPrivacyPolicy" link={privacyPolicyLink} />}
      </label>

      <br />
      <br />

      <label>
        <input type="checkbox" ref="okayToEmail" defaultChecked={true} disabled={this.props.user != null} onChange={this.forceUpdate.bind(this, null)} />
        {this.state.underAge ? <Translate component="span" content="registerForm.underAgeEmail" /> : <Translate component="span" content="registerForm.okayToEmail" />}
      </label><br />

      <label>
        <input type="checkbox" ref="betaTester" disabled={this.props.user != null} onChange={this.forceUpdate.bind(this, null)} />
        <Translate component="span" content="registerForm.betaTester" />
      </label><br />

      <p style={{
      textAlign: 'center'
    }}>
        {'user' in this.state.pending ? <LoadingIndicator /> : this.props.user != null ? <span className="form-help warning">
            <Translate content="registerForm.alreadySignedIn" name={this.props.user.login} />{' '}
            <button type="button" className="minor-button" onClick={this.handleSignOut}><Translate content="registerForm.signOut" /></button>
          </span> : this.state.error != null ? <span className="form-help error">{this.state.error.toString()}</span> : <span>&nbsp;</span>}
      </p>

      <div>
        <button type="submit" className="standard-button full" disabled={!this.isFormValid() || Object.keys(this.state.pending).length !== 0 || (this.props.user != null)}>
          <Translate content="registerForm.register" />
        </button>
      </div>
    </form>;
  },
  updateAge: function() {
    return this.setState({
      underAge: !this.state.underAge
    });
  },
  handleNameChange: function() {
    var badChars, char, exists, name;
    name = this.refs.name.value;
    exists = name.length !== 0;
    badChars = (function() {
      var i, len, ref, results;
      ref = name.split('');
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
      if (this.debouncedCheckForNameConflict == null) {
        this.debouncedCheckForNameConflict = debounce(this.checkForNameConflict, REMOTE_CHECK_DELAY);
      }
      return this.debouncedCheckForNameConflict(name);
    }
  },
  debouncedCheckForNameConflict: null,
  checkForNameConflict: function(username) {
    return this.promiseToSetState({
      nameConflict: auth.register({
        login: username
      }).catch(function(error) {
        var ref;
        return (ref = error.message.match(/login(.+)taken/mi)) != null ? ref : false;
      })
    });
  },
  handlePasswordChange: function() {
    var asLong, confirmedPassword, exists, longEnough, matches, password;
    password = this.refs.password.value;
    confirmedPassword = this.refs.confirmedPassword.value;
    exists = password.length !== 0;
    longEnough = password.length >= MIN_PASSWORD_LENGTH;
    asLong = confirmedPassword.length >= password.length;
    matches = password === confirmedPassword;
    return this.setState({
      passwordTooShort: exists ? !longEnough : void 0,
      passwordsDontMatch: exists && asLong ? !matches : void 0
    });
  },
  handleEmailChange: function() {
    var email;
    this.promiseToSetState({
      emailConflict: Promise.resolve(null) // Cancel any existing request.
    });
    email = this.refs.email.value;
    if (email.match(/.+@.+\..+/)) {
      if (this.debouncedCheckForEmailConflict == null) {
        this.debouncedCheckForEmailConflict = debounce(this.checkForEmailConflict, REMOTE_CHECK_DELAY);
      }
      return this.debouncedCheckForEmailConflict(email);
    }
  },
  debouncedCheckForEmailConflict: null,
  checkForEmailConflict: function(email) {
    return this.promiseToSetState({
      emailConflict: auth.register({email}).catch(function(error) {
        var ref;
        return (ref = error.message.match(/email(.+)taken/mi)) != null ? ref : false;
      })
    });
  },
  handlePrivacyPolicyChange: function() {
    return this.setState({
      agreesToPrivacyPolicy: this.refs.agreesToPrivacyPolicy.checked
    });
  },
  isFormValid: function() {
    var agreesToPrivacyPolicy, badNameChars, emailConflict, nameConflict, nameExists, passwordsDontMatch;
    ({badNameChars, nameConflict, passwordsDontMatch, emailConflict, agreesToPrivacyPolicy, nameExists} = this.state);
    return (badNameChars != null ? badNameChars.length : void 0) === 0 && !nameConflict && !passwordsDontMatch && !emailConflict && nameExists && agreesToPrivacyPolicy;
  },
  handleSubmit: function(e) {
    var base, beta_email_communication, credited_name, email, global_email_communication, login, password, project_email_communication, project_id, ref, ref1;
    if ((ref = this.context.geordi) != null) {
      ref.logEvent({
        type: 'register'
      });
    }
    e.preventDefault();
    login = this.refs.name.value;
    password = this.refs.password.value;
    email = this.refs.email.value;
    credited_name = this.refs.realName.value;
    global_email_communication = this.refs.okayToEmail.checked;
    project_email_communication = global_email_communication;
    beta_email_communication = this.refs.betaTester.checked;
    project_id = (ref1 = this.props.project) != null ? ref1.id : void 0;
    this.setState({
      error: null
    });
    if (typeof (base = this.props).onSubmit === "function") {
      base.onSubmit();
    }
    return auth.register({login, password, email, credited_name, project_email_communication, global_email_communication, project_id, beta_email_communication}).then(() => {
      var base1;
      return typeof (base1 = this.props).onSuccess === "function" ? base1.onSuccess(...arguments) : void 0;
    }).catch((error) => {
      var base1;
      this.setState({error});
      return typeof (base1 = this.props).onFailure === "function" ? base1.onFailure(...arguments) : void 0;
    });
  },
  handleSignOut: function() {
    return auth.signOut();
  }
});
