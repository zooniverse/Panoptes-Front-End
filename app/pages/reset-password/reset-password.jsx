import PropTypes from 'prop-types';
import React from 'react';
import auth from 'panoptes-client/lib/auth';
import Translate from 'react-translate-component';
import alert from '../../lib/alert';
import LoginDialog from '../../partials/login-dialog';
import SubmitEmailForm from './submit-email-form';
import NewPasswordForm from './new-password-form';

class ResetPasswordPage extends React.Component {
  constructor() {
    super();

    this.state = {
      inProgress: false,
      resetSuccess: false,
      resetError: null,
      emailSuccess: false,
      emailError: null,
      emailIsValid: false
    };

    this.handlePasswordResetSubmit = this.handlePasswordResetSubmit.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ emailIsValid: event.target.checkValidity() });
  }

  handleEmailSubmit(event) {
    event.preventDefault();

    this.setState({
      inProgress: true,
      emailSuccess: false,
      emailError: null
    });

    const email = event.target[0].value;

    auth.requestPasswordReset({ email })
      .then(() => {
        this.setState({
          emailSuccess: true,
          inProgress: false
        });
      })
      .catch((error) => {
        this.setState({ emailError: error });
      });
  }

  handlePasswordResetSubmit(event) {
    event.preventDefault();

    this.setState({
      inProgress: true,
      resetSuccess: false,
      resetError: null
    });

    const token = this.props.location.query.reset_password_token;
    const password = event.target[0].value;
    const confirmation = event.target[1].value;
    const passwordMatch = password === confirmation
    if (!passwordMatch) {
      this.setState({
        inProgress: false,
        resetError: <Translate
          component="p"
          content="resetPassword.passwordsDoNotMatch"
        />
      });
      return;
    }

    auth.resetPassword({ password, confirmation, token })
      .then(() => {
        this.setState({
          resetSuccess: true,
        });
        alert(resolve => <LoginDialog onSuccess={resolve} />);
        this.context.router.push('/projects');
      })
      .catch((error) => {
        this.setState({
          resetError: error.message
        });
      })
      .then(() => {
        this.setState({
          inProgress: false
        });
      });
  }

  render() {
    return (
      <div className="centered-grid">
        <Translate
          component="h1"
          content="resetPassword.heading"
        />

        {this.props.location.query && !this.props.location.query.reset_password_token &&
          <SubmitEmailForm
            user={this.props.user}
            onSubmit={this.handleEmailSubmit}
            onChange={this.handleEmailChange}
            disabled={!this.state.emailIsValid}
            inProgress={this.state.inProgress}
            emailSuccess={this.state.emailSuccess}
            emailError={this.state.emailError}
          />}

        {this.props.location.query && this.props.location.query.reset_password_token && !this.state.resetSuccess &&
          <NewPasswordForm
            onSubmit={this.handlePasswordResetSubmit}
            disabled={this.state.resetSuccess}
            inProgress={this.state.inProgress}
            resetSuccess={this.state.resetSuccess}
            resetError={this.state.resetError}
          />}
      </div>
    );
  }
}

ResetPasswordPage.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      reset_password_token: PropTypes.string
    })
  }),
  user: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

ResetPasswordPage.defaultProps = {
  location: {
    query: {
      reset_password_token: null
    }
  },
  user: null
};

ResetPasswordPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default ResetPasswordPage;