import React from 'react';
import AutoSave from '../../components/auto-save';
import handleInputChange from '../../lib/handle-input-change';
import ChangePasswordForm from './change-password-form';

export default class AccountInformationPage extends React.Component {

  render() {
    return (  
      <div className="account-information-tab">
        <div className="columns-container">
          <div className="content-container column">
            <p>
              <AutoSave resource={this.props.user}>
                <span className="form-label">
                  <label htmlFor="displayName">Display name (required)</label>
                </span>
                <br />
                <input type="text" id="displayName" className="standard-input full" name="display_name" value={this.props.user.display_name} onChange={handleInputChange.bind(this.props.user)} />
              </AutoSave>
              <span className="form-help">How your name will appear to other users in Talk and on your Profile Page</span>
              <br />
              <AutoSave resource={this.props.user}>
                <label htmlFor="realName">
                  <span className="form-label">Real name (optional)</span>
                </label>
                <br />
                <input type="text" id="realName" className="standard-input full" name="credited_name" value={this.props.user.credited_name} onChange={handleInputChange.bind(this.props.user)} />
              </AutoSave>
              <span className="form-help">Public; we’ll use this to give acknowledgement in papers, on posters, etc.</span>
            </p>
          </div>
        </div>
        <hr />
        <div className="content-container">
          {<ChangePasswordForm {...this.props} />}
        </div>
      </div>
    );
  }
}