import React, { Component } from 'react';

import AutoSave from '../../components/auto-save';
import handleInputChange from '../../lib/handle-input-change';
import UserLimitToggle from './user-settings/limit-toggle';

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.boundForceUpdate = this.forceUpdate.bind(this);
  }

  componentDidMount() {
    if (this.props.editUser != null) {
      this.props.editUser.listen('change', this.boundForceUpdate);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.editUser != null) {
      this.props.editUser.stopListening('change', this.boundForceUpdate);
    }
    nextProps.editUser.listen('change', this.boundForceUpdate);
  }

  render() {
    if (!this.props.editUser) {
      return (
        <div>No user found</div>
      );
    }

    const handleChange = handleInputChange.bind(this.props.editUser);

    return (
      <div className="project-status">
        <h4>Settings for {this.props.editUser.login}</h4>
        <ul>
          <li>
            <AutoSave resource={this.props.editUser}>
              <input type="checkbox" name="admin" checked={this.props.editUser.admin} disabled onChange={handleChange} />{' '}
              Admin
            </AutoSave>
          </li>
          <li>
            <AutoSave resource={this.props.editUser}>
              <input type="checkbox" name="login_prompt" checked={this.props.editUser.login_prompt} disabled onChange={handleChange} />{' '}
              Login prompt
            </AutoSave>
          </li>
          <li>
            <AutoSave resource={this.props.editUser}>
              <input type="checkbox" name="private_profile" checked={this.props.editUser.private_profile} disabled onChange={handleChange} />{' '}
              Private profile
            </AutoSave>
          </li>
          <li>
            <AutoSave resource={this.props.editUser}>
              <input type="checkbox" name="upload_whitelist" checked={this.props.editUser.upload_whitelist} onChange={handleChange} />{' '}
              Whitelist subject uploads
            </AutoSave>
          </li>
        </ul>

        <ul>
          <li>Uploaded subjects: {this.props.editUser.uploaded_subjects_count}</li>
          <li><UserLimitToggle editUser={this.props.editUser} /></li>
        </ul>
      </div>
    );
  }
}

UserSettings.defaultProps = {
  editUser: null
};

export default UserSettings;
