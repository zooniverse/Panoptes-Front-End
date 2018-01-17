import PropTypes from 'prop-types';
import React, { Component } from 'react';
import auth from 'panoptes-client/lib/auth';


class UnsubscribeFromEmails extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      emailSuccess: false,
      emailError: false,
      emailIsValid: false,
      emailValue: '',
      inProgress: false,
    };
  }
  componentDidMount() {
    return this.handleChange;
  }

  handleChange(event) {
    const emailIsValid = event.target.checkValidity ? event.target.checkValidity() : true;
    const emailValue = event.target.value;
    this.setState({
      emailIsValid,
      emailValue
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const email = this.state.emailValue;
    this.setState({
      inProgress: true,
      emailSuccess: false,
      emailError: false
    });
    auth.unsubscribeEmail({ email })
      .then(() => this.setState({ emailSuccess: true }))
      .catch((error) => {
        this.setState({ emailError: true });
        console.log('Email unsubscribe error: ', error);
      })
      .then(() => this.setState({ inProgress: false }));
  }

  renderForm(defaultValue, disabledButton) {
    return (
      <form onSubmit={this.handleSubmit}>
        <p><strong>Unsubscribe from all Zooniverse emails, except Talk.</strong></p>
        <p>We get it - no one likes to keep receiving email they don't want.</p>
        <p>Just enter your email address here and we'll <b>unsubscribe you from all</b> our email lists.</p>
        <p>
          <input
            className="standard-input"
            defaultValue={defaultValue}
            onChange={this.handleChange}
            required={true}
            size="50"
            type="email"
          />
        </p>
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
        <small className="form-help error">
          There was an error unsubscribing your email.
        </small>
      );
    }
    return null;
  }

  renderTokenFlowFeedback() {
    return (
      <div>
        <p><strong>Your unsubscribe request was successfully processed.</strong></p>
        <p>If you change your mind, just visit your <a href="/settings">account settings</a> page to update your email preferences.</p>
      </div>
    );
  }

  render() {
    const { location } = this.props;
    const defaultValue = location.query ? location.query.email : '';
    const disabledButton = !this.state.emailIsValid || this.state.emailSuccess;
    const query = location.query ? location.query : {};
    return (
      <div className="centered-grid">
        {query.processed
        ? this.renderTokenFlowFeedback()
        : this.renderForm(defaultValue, disabledButton)}
      </div>
    );
  }
}

UnsubscribeFromEmails.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      email: PropTypes.string,
      processed: PropTypes.string
    })
  })
};

export default UnsubscribeFromEmails;