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
      editUser: null
    };
  }

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    apiClient.type('users').get(this.props.params.id).then((editUser) => {
      editUser.listen('change', this.boundForceUpdate);
      this.setState({ editUser });
    });
  }

  componentWillUnmount() {
    this.state.editUser.stopListening('change', this.boundForceUpdate);
  }

  render() {
    if (!this.state.editUser) {
      return (
        <div>No user found</div>
      );
    }

    if (this.state.editUser === this.props.user) {
      return <div>You cannot edit your own account</div>;
    }

    const handleChange = handleInputChange.bind(this.state.editUser);

    return (
      <div>
        <div className="project-status">
          <h4>Settings for {this.state.editUser.login}</h4>

          <UserProperties user={this.state.editUser} />

          <ul>
            <li>Uploaded subjects: {this.state.editUser.uploaded_subjects_count}</li>
            <li><UserLimitToggle editUser={this.state.editUser} /></li>
          </ul>

          <DeleteUser user={this.state.editUser} />
        </div>

        <UserProjects user={this.state.editUser} />
      </div>
    );
  }
}

UserSettings.propTypes = {
  user: React.PropTypes.object,
  editUser: React.PropTypes.object
};

UserSettings.defaultProps = {
  editUser: null
};

export default UserSettings;
