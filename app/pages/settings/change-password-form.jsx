import React from 'react';
import auth from 'panoptes-client/lib/auth';
import counterpart from 'counterpart';

const MIN_PASSWORD_LENGTH = 8;

export default class ChangePasswordForm extends React.Component {

  constructor() {
    super();
    this.state = {
      old: '',
      new: '',
      confirmation: '',
      inProgress: false,
      success: false,
      error: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changePasswordForm = React.createRef();
  }

  handleSubmit(e) {
    e.preventDefault();
    const current = this.state.old;
    const replacement = this.state.new;

    this.setState({
      inProgress: true,
      success: false,
      error: null
    });

    auth.changePassword({ current, replacement })
      .then(() => {
        this.setState({ success: true });
        this.changePasswordForm.current.reset();
      })
      .catch((error) => {
        this.setState({ error });
      })
      .then(() => {
        this.setState({ inProgress: false });
      });
  }

  doesntMatch() {
    return this.state.new !== this.state.confirmation;
  }

  tooShort() {
    return this.state.new.length < MIN_PASSWORD_LENGTH;
  }

  renderStatus() {
    let status = null;
    if (this.state.inProgress) {
      status = <i className="fa fa-spinner fa-spin form-help"></i>;
    } else if (this.state.success) {
      status = <i className="fa fa-check-circle form-help success"></i>;
    } else if (this.state.error) {
      status = <small className="form-help error">{this.state.error.toString()}</small>;
    }
    return status;
  }

  render() {
    return (
      <form ref={this.changePasswordForm} method="POST" onSubmit={this.handleSubmit}>
        <p>
          <strong>{counterpart('userSettings.account.changePassword.heading')}</strong>
        </p>
        <div>
          <label>
            <span className="form-label">{counterpart('userSettings.account.changePassword.currentPassword')}</span>
            <br />
            <input
              type="password"
              className="standard-input"
              size="30"
              onChange={(e) => { this.setState({ old: e.target.value }); }}
              required
            />
          </label>
        </div>
        <div>
          <label>
            <span className="form-label">{counterpart('userSettings.account.changePassword.newPassword')}</span>
            <br />
            <input
              type="password"
              className="standard-input"
              size="30"
              onChange={(e) => { this.setState({ new: e.target.value }); }}
              required
            />
          </label>
          {this.state.new.length > 0 && this.tooShort() ?
            <small className="form-help error">{counterpart('userSettings.account.changePassword.tooShort')}</small>
            : null}
        </div>
        <div>
          <label>
            <span className="form-label">{counterpart('userSettings.account.changePassword.confirmNewPassword')}</span>
            <br />
            <input
              type="password"
              className="standard-input"
              size="30"
              onChange={(e) => { this.setState({ confirmation: e.target.value }); }}
              required
            />
          </label>
          {this.state.confirmation.length >= this.state.new.length - 1 && this.doesntMatch() ?
            <small className="form-help error">{counterpart('userSettings.account.changePassword.doesntMatch')}</small>
            : null}
        </div>
        <p>
          <button
            type="submit"
            className="standard-button"
            disabled={!this.state.old || !this.state.new || this.tooShort() || this.doesntMatch() || this.state.inProgress}
          >
            {counterpart('userSettings.account.changePassword.change')}
          </button>{' '}
          {this.renderStatus()}
        </p>
      </form>
    );
  }
}
