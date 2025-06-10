/*
Basic Sign-In Form
Renders a form that allows users to provide their sign-in details and attempt
to sign in.

Converted from CoffeeScript on 15 May 2025. There's room for improvement.
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Translate from 'react-translate-component';
import auth from 'panoptes-client/lib/auth';
import LoadingIndicator from '../components/loading-indicator';

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
    const disabled = !!this.props.user || this.state.busy;
    return (
      <form className="sign-in-form" method="POST" onSubmit={this.handleSubmit}>

        <div style={{ margin: '1em 0' }}>

          <div style={{ margin: '1em 0' }}>
            <label style={{ display: 'block' }} htmlFor="sign-in-form-login">
              <Translate content="signInForm.userName" />
            </label>
            <input
              type="text"
              className="standard-input full"
              name="login"
              id="sign-in-form-login"
              value={this.state.login}
              disabled={disabled}
              autoFocus
              onChange={this.handleInputChange}
              maxLength="255"
            />
          </div>

          <div style={{ margin: '1em 0' }}>
            <label style={{ display: 'block' }} htmlFor="sign-in-form-password">
              <Translate content="signInForm.password" />
            </label>
            <input
              type="password"
              className="standard-input full"
              name="password"
              id="sign-in-form-password"
              value={this.state.password}
              disabled={disabled}
              onChange={this.handleInputChange}
            />
          </div>

        </div>

        <div style={{ textAlign: 'center', margin: '1em 0' }}>
          
          {this.props.user && ( 
            <div className="form-help">
              <Translate content="signInForm.alreadySignedIn" name={this.props.user.login} />{' '}
              <button type="button" className="minor-button" onClick={this.handleSignOut}>
                <Translate content="signInForm.signOut" />
              </button>
            </div>
          )}

          {this.state.error && (
            <div className="form-help error">
              {this.state.error.message.match(/invalid(.+)password/i) ? (
                <Translate content="signInForm.incorrectDetails" />
              ) : (
                <span>{this.state.error.toString()}</span>
              )}{' '}
            </div>
          )}

          {this.state.busy ? (
            <LoadingIndicator />
          ) : (
            <a href={`${window.location.origin}/reset-password`}>
              <Translate content="signInForm.forgotPassword" />
            </a>
          )}
        </div>

        <div className="form-row submit-row">
          <button
            type="submit"
            className="standard-button"
            disabled={disabled || this.state.login.length === 0 || this.state.password.length === 0}
          >
            <Translate content="signInForm.signIn" />
          </button>
        </div>
        
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
    const { onSuccess, onSubmit, onFailure } = this.props;

    e.preventDefault();
    return this.setState({
      working: true
    }, () => {
      const {login, password} = this.state;
      auth.signIn({login, password}).then((user) => {
        this.setState({
          working: false,
          error: null
        })

        onSuccess?.(user);
        // Historical note: onSuccess used to be in the callback for setState(), but for some reason, that callback doesn't trigger.

      }).catch((error) => {
        this.setState({
          working: false,
          error: error
        })

        const ref = ReactDOM.findDOMNode(this).querySelector('[name="login"]');
        ref?.focus();
        onFailure?.(error);
      });

      return onSubmit?.(e);
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

SignInForm.propTypes = {
  onFailure: PropTypes.func,
  onSubmit: PropTypes.func,
  onSuccess: PropTypes.func,
  user: PropTypes.object
};

export { SignInForm };
