import PropTypes from 'prop-types';
import React, { Component } from 'react';
import auth from 'panoptes-client/lib/auth';

class GeneralUnsubscribe extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      emailSuccess: false,
      emailError: false,
      inProgress: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const email = this.props.user ? this.props.user.email : null;
    this.setState({
      inProgress: true,
      emailSuccess: false,
      emailError: false
    });
    auth.unsubscribeEmail({ email })
      .then(() => this.setState({ emailSuccess: true }))
      .catch((error) => {
        this.setState({ emailError: true });
        console.log('Email unsubscribe error: ', error.message);
      })
      .then(() => this.setState({ inProgress: false }));
  }

  renderForm(disabledButton) {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>Unsubscribe from all Zooniverse emails, except Talk.</p>
        <p>
          <button
            className="standard-button"
            disabled={disabledButton}
            type="submit"
          >Submit
          </button>
          {' '}
          {this.renderIconFeedback()}
        </p>
        {this.renderTextFeedback()}
      </form>
    );
  }

  renderIconFeedback() {
    if (this.state.inProgress) {
      return <i className="fa fa-spinner fa-spin form-help" />;
    } else if (this.state.emailSuccess) {
      return <i className="fa fa-check-circle form-help success" />;
    }
    return null;
  }

  renderTextFeedback() {
    if (this.state.emailSuccess) {
      return <p>You've been unsubscribed!</p>;
    } else if (this.state.emailError) {
      return (
        <p className="form-help error">
          There was an error unsubscribing your email.
        </p>
      );
    }
    return null;
  }

  render() {
    const disabledButton = this.state.emailSuccess;
    return this.renderForm(disabledButton);
  }
}

GeneralUnsubscribe.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string
  })
};

export default GeneralUnsubscribe;
