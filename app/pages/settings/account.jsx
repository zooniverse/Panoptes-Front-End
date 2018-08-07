import React from 'react';
import counterpart from 'counterpart';
import AutoSave from '../../components/auto-save';
import handleInputChange from '../../lib/handle-input-change';
import ChangePasswordForm from './change-password-form';

export default function AccountInformationPage(props) {
  return (
    <div className="account-information-tab">
      <div className="columns-container">
        <div className="content-container column">
          <p>
            <AutoSave resource={props.user}>
              <span className="form-label">
                <label htmlFor="displayName">{counterpart('userSettings.account.displayName')}</label>
              </span>
              <br />
              <input
                type="text"
                id="displayName"
                className="standard-input full"
                name="display_name"
                value={props.user.display_name}
                onChange={handleInputChange.bind(props.user)}
              />
            </AutoSave>
            <span className="form-help">{counterpart('userSettings.account.displayNameHelp')}</span>
            <br />
            <AutoSave resource={props.user}>
              <label htmlFor="realName">
                <span className="form-label">{counterpart('userSettings.account.realName')}</span>
              </label>
              <br />
              <input
                type="text"
                id="realName"
                className="standard-input full"
                name="credited_name"
                value={props.user.credited_name}
                onChange={handleInputChange.bind(props.user)}
              />
            </AutoSave>
            <span className="form-help">{counterpart('userSettings.account.realNameHelp')}</span>
          </p>
        </div>
      </div>
      <hr />
      <div className="content-container">
        {<ChangePasswordForm {...props} />}
      </div>
    </div>
  );
}