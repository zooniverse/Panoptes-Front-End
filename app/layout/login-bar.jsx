import counterpart from 'counterpart';
import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import alert from '../lib/alert';
import LoginDialog from '../partials/login-dialog';

counterpart.registerTranslations('en', {
  loginBar: {
    signIn: 'Sign in',
    register: 'Register',
  },
});

class LoginBar extends React.Component {
  static contextTypes = {
    geordi: PropTypes.object
  };

  showDialog = (event) => {
    const which = event.currentTarget.value;
    this.context.geordi.logEvent({
      type: which === 'sign-in' ? 'login' : 'register-link',
    });
    alert((resolve) => <LoginDialog which={which} onSuccess={resolve} contextRef={this.context} />);
  };

  render() {
    return (
      <span className="login-bar">
        <button type="button" value="sign-in" className="secret-button" onClick={this.showDialog}>
          <span className="site-nav__link">
            <Translate content="loginBar.signIn" />
          </span>
        </button>

        <span className="site-nav__link-buncher"></span>

        <button type="button" value="register" className="secret-button" onClick={this.showDialog}>
          <span className="site-nav__link">
            <Translate content="loginBar.register" />
          </span>
        </button>
      </span>
    );
  }
}

export default LoginBar;