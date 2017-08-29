import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

import AutoSave from '../../components/auto-save';
import LoadingIndicator from '../../components/loading-indicator';
import handleInputChange from '../../lib/handle-input-change';
import UserProperties from './user-settings/properties';
import UserProjects from './user-settings/projects';
import UserLimitToggle from './user-settings/limit-toggle';
import DeleteUser from './user-settings/delete-user';


class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.boundForceUpdate = this.forceUpdate.bind(this);
    this.getUser = this.getUser.bind(this);

    this.state = {
      user: null
    };
  }

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    apiClient.type('users').get(this.props.params.id).then((user) => {
      user.listen('change', this.boundForceUpdate);
      this.setState({ user });
    });
  }

  componentWillUnmount() {
    this.state.user.stopListening('change', this.boundForceUpdate);
  }

  render() {
    if (!this.state.user) {
      return (
        <div>No user found</div>
      );
    }

    const handleChange = handleInputChange.bind(this.state.user);

    return (
      <div>
        <div className="project-status">
          <h4>Settings for {this.state.user.login}</h4>

          <UserProperties user={this.state.user} />

          <ul>
            <li>Uploaded subjects: {this.state.user.uploaded_subjects_count}</li>
            <li><UserLimitToggle editUser={this.state.user} /></li>
          </ul>

          <DeleteUser user={this.state.user} />
        </div>

        <UserProjects user={this.state.user} />
      </div>
    );
  }
}

UserSettings.propTypes = {
  editUser: React.PropTypes.object
};

UserSettings.defaultProps = {
  editUser: null
};

export default UserSettings;
