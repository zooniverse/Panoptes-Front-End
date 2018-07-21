import React from 'react';
import auth from 'panoptes-client/lib/auth';

const MIN_PASSWORD_LENGTH = 8

export default class ChangePasswordForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      old: '',
      new: '',
      confirmation: '',
      inProgress: false,
      success: false,
      error: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);  
  }

  handleSubmit(e) {
    e.preventDefault()

    const current = this.state.old
    const replacement = this.state.new

    this.setState({
      inProgress: true,
      success: false,
      error: null
    })
  
    auth.changePassword({ current, replacement }) 
      .then(() => {
        this.setState({ success: true })
        this.refs.form.reset();
      })
      .catch((error) => {
        this.setState({ error })
      })
      .then(() => {
        this.setState({ inProgress: false })
      })
  }

  doesntMatch() {
    return this.state.new !== this.state.confirmation;
  }

  tooShort() {
    return this.state.new.length < MIN_PASSWORD_LENGTH
  }

  render() {
    return (
      <form ref="form" method="POST" onSubmit={this.handleSubmit}>
        <p>
          <strong>Change your password</strong>
        </p>
        <table className="standard-table">
        <tbody>
          <tr>
            <td><label htmlFor="currentPassword">Current password (required)</label></td>
            <td>
              <input type="password" id="currentPassword" className="standard-input" size="20" onChange={(e) => this.setState({ old: e.target.value })} required />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="newPassword">New password (required)</label></td>
            <td>
              <input type="password" id="newPassword" className="standard-input" size="20" onChange={(e) => this.setState({ new: e.target.value })} required />
              { this.state.new.length > 0 && this.tooShort() ? <small className="form-help error">That’s too short</small> : null}
            </td>
          </tr>
          <tr>
            <td><label htmlFor="confirmPassword">Confirm new password (required)</label></td>
            <td>
              <input type="password" id="confirmPassword" className="standard-input" size="20" onChange={(e) => this.setState({ confirmation: e.target.value })} required />
              { this.state.confirmation.length >= this.state.new.length - 1 && this.doesntMatch() ? <small className="form-help error">These don’t match</small> : null }
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        <button type="submit" className="standard-button" disabled={!this.state.old || !this.state.new || this.tooShort() || this.doesntMatch() || this.state.inProgress}>Change</button>{' '}
        { 
          this.state.inProgress 
            ? <i className="fa fa-spinner fa-spin form-help"></i> : this.state.success 
            ? <i className="fa fa-check-circle form-help success"></i> : this.state.error 
            ? <small className="form-help error">{this.state.error.toString()}</small> : null
        }        
      </p>
      </form>
    );
  }
}