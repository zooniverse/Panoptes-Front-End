import React from 'react';
import counterpart from 'counterpart';
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
                  <label htmlFor="displayName">{counterpart('userSettings.account.displayName')}</label>
                </span>
                <br />
                <input
                  type="text"
                  id="displayName"
                  className="standard-input full"
                  name="display_name"
                  value={this.props.user.display_name}
                  onChange={handleInputChange.bind(this.props.user)}
                />
              </AutoSave>
              <span className="form-help">{counterpart('userSettings.account.displayNameHelp')}</span>
              <br />
              <AutoSave resource={this.props.user}>
                <label htmlFor="realName">
                  <span className="form-label">{counterpart('userSettings.account.realName')}</span>
                </label>
                <br />
                <input
                  type="text"
                  id="realName"
                  className="standard-input full"
                  name="credited_name"
                  value={this.props.user.credited_name}
                  onChange={handleInputChange.bind(this.props.user)}
                />
              </AutoSave>
              <span className="form-help">{counterpart('userSettings.account.realNameHelp')}</span>
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
