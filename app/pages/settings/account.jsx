import React from 'react';
import createReactClass from 'create-react-class';
import AutoSave from '../../components/auto-save';
import handleInputChange from '../../lib/handle-input-change';
import auth from 'panoptes-client/lib/auth';

import DeleteAccount from './delete-account';

const MIN_PASSWORD_LENGTH = 8;

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    
    if (!this.props.user) {
      this.props.user = {};
    }
    
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.state = {
      old: '',
      new: '',
      confirmation: '',
      inProgress: false,
      success: false,
      error: null
    }
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
              <td>Current password</td>
              <td><input type="password" className="standard-input" size="20" onChange={(e) => this.setState({old: e.target.value}) } /></td>
            </tr>
            <tr>
              <td>New password</td>
              <td>
                <input type="password" className="standard-input" size="20" onChange={(e) => this.setState({new: e.target.value}) } />
                {this.renderFormError()}
              </td>
            </tr>
            <tr>
              <td>Confirm new password</td>
              <td>
                <input type="password" className="standard-input" size="20" onChange={(e) => this.setState({confirmation: e.target.value})} />
                {this.renderMatchError()}
              </td>
            </tr>
          </tbody>
        </table>

        <p>
          <button type="submit" className="standard-button" disabled={!this.state.old || !this.state.new || this.tooShort() || this.doesntMatch() || this.state.inProgress }>Change</button>{' '}
          { this.renderFormState() }
        </p>
      </form>
    );
  }

  renderFormState() {
    if (this.state.inProgress) {
      return <i className="fa fa-spinner fa-spin form-help"></i>;
    } else if (this.state.success) {
      return <i className="fa fa-check-circle form-help success"></i>;
    } else if (this.state.error) {
      return <small className="form-help error">{this.state.error.toString()}</small>
    }
  }

  renderFormError() {
    if (this.state.new.length !== 0 && this.tooShort()) { 
        return <small className="form-help error">That’s too short</small>;
    }
  }
  
  renderMatchError() {
    if (this.state.confirmation.length >= this.state.new.length - 1 && this.doesntMatch()) {
        return <small className="form-help error">These don’t match</small>;
    }
  }

  tooShort() {
    return this.state.new.length < MIN_PASSWORD_LENGTH;
  }

  doesntMatch() {
    return this.state.new !== this.state.confirmation;
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

    auth.changePassword({current, replacement}).then(() => {
      this.setState({success: true});
      this.refs.form.reset();
    }).catch((error) => {
      this.setState({error});
    }).then(() => {
      this.setState({inProgress: false});
    })
  }
}

export default class AccountInformationPage extends React.Component {
  render() {
    return (
      <div className="account-information-tab">
        <div className="columns-container">
          <div className="content-container column">
            <p>
              <AutoSave resource={this.props.user}>
                <span className="form-label">Display name</span>
                <br />
                <input type="text" className="standard-input full" name="display_name" value={this.props.user.display_name} onChange={handleInputChange.bind(this.props.user)} />
              </AutoSave>
              <span className="form-help">How your name will appear to other users in Talk and on your Profile Page</span>
              <br />

              <AutoSave resource={this.props.user}>
                <span className="form-label">Real name</span>
                <br />
                <input type="text" className="standard-input full" name="credited_name" value={this.props.user.credited_name} onChange={handleInputChange.bind(this.props.user)} />
              </AutoSave>
              <span className="form-help">Public; we’ll use this to give acknowledgement in papers, on posters, etc.</span>
            </p>
          </div>
        </div>

        <hr />

        <div className="content-container">
          <ChangePasswordForm {...this.props} />
        </div>

        <hr />
        
        <div className="content-container">
          <DeleteAccount {...this.props} />
        </div>
      </div>
    );
  }
}
