/*
Basic Sign-In Form
Renders a form that allows users to provide their sign-in details and attempt
to sign in.

Converted from CoffeeScript on 15 May 2025. There's room for improvement.
 */

import counterpart from 'counterpart';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Translate from 'react-translate-component';
import auth from 'panoptes-client/lib/auth';
import LoadingIndicator from '../components/loading-indicator';

counterpart.registerTranslations('en', {
  signInForm: {
    signIn: 'Sign in',
    signOut: 'Sign out',
    userName: 'User name or email address',
    password: 'Password',
    incorrectDetails: 'Username or password incorrect',
    forgotPassword: 'Forgot my password'
  }
});

class SignInForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      busy: false,
      login: '',
      password: '',
      error: null
    };
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render () {
    var disabled, ref, ref1, ref2;
    disabled = (this.props.user != null) || this.state.busy;
    return (
      <form method="POST" onSubmit={this.handleSubmit}>
        <label>
          <Translate content="signInForm.userName" />
          <input type="text" className="standard-input full" name="login" value={(ref = this.props.user) != null ? ref.login : void 0} disabled={disabled} autoFocus onChange={this.handleInputChange} maxLength="255" />
        </label>

        <br />

        <label>
          <Translate content="signInForm.password" /><br />
          <input type="password" className="standard-input full" name="password" value={(ref1 = this.props.user) != null ? ref1.password : void 0} disabled={disabled} onChange={this.handleInputChange} />
        </label>

        <p style={{
        textAlign: 'center'
      }}>
          {this.props.user != null ? <div className="form-help">
              Signed in as {this.props.user.login}{' '}
              <button type="button" className="minor-button" onClick={this.handleSignOut}>
                <Translate content="signInForm.signOut" />
              </button>
            </div> : this.state.error != null ? <div className="form-help error">
              {this.state.error.message.match(/invalid(.+)password/i) ? <Translate content="signInForm.incorrectDetails" /> : <span>{this.state.error.toString()}</span>}{' '}

              <a href={`${window.location.origin}/reset-password`} onClick={this.props.onSuccess}>
                <Translate content="signInForm.forgotPassword" />
              </a>
            </div> : this.state.busy ? <LoadingIndicator /> : <a href={`${window.location.origin}/reset-password`} onClick={this.props.onSuccess}>
              <Translate content="signInForm.forgotPassword" />
            </a>}
        </p>

        <button type="submit" className="standard-button full" disabled={disabled || this.state.login.length === 0 || this.state.password.length === 0} onClick={(ref2 = this.context.geordi) != null ? ref2.logEvent({
        type: 'login'
      }) : void 0}>
          <Translate content="signInForm.signIn" />
        </button>
      </form>
    );
  }

  handleInputChange (e) {
    var newState;
    newState = {};
    newState[e.target.name] = e.target.value;
    return this.setState(newState);
  }

  handleSubmit (e) {
    e.preventDefault();
    return this.setState({
      working: true
    }, () => {
      var base, login, password;
      ({login, password} = this.state);
      auth.signIn({login, password}).then((user) => {
        return this.setState({
          working: false,
          error: null
        }, () => {
          var base;
          return typeof (base = this.props).onSuccess === "function" ? base.onSuccess(user) : void 0;
        });
      }).catch((error) => {
        return this.setState({
          working: false,
          error: error
        }, () => {
          var base, ref;
          if ((ref = ReactDOM.findDOMNode(this).querySelector('[name="login"]')) != null) {
            ref.focus();
          }
          return typeof (base = this.props).onFailure === "function" ? base.onFailure(error) : void 0;
        });
      });
      return typeof (base = this.props).onSubmit === "function" ? base.onSubmit(e) : void 0;
    });
  }

  handleSignOut () {
    return this.setState({
      busy: true
    }, () => {
      return auth.signOut().then(() => {
        return this.setState({
          busy: false,
          password: ''
        });
      });
    });
  }
}

SignInForm.contextTypes = {
  geordi: PropTypes.object
};

SignInForm.propTypes = {
  onFailure: PropTypes.func,
  onSuccess: PropTypes.func,
  user: PropTypes.object
};

export { SignInForm }
