import PropTypes from 'prop-types';
import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

import UserDetails from './user-settings/details';
import UserProperties from './user-settings/properties';
import UserResources from './user-settings/resources';
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

  componentWillUnmount() {
    this.state.editUser.stopListening('change', this.boundForceUpdate);
  }

  getUser() {
    apiClient.type('users').get(this.props.params.id).then((editUser) => {
      editUser.listen('change', this.boundForceUpdate);
      this.setState({ editUser });
    });
  }

  render() {
    if (!this.state.editUser) {
      return (
        <div>No user found</div>
      );
    }

    if (this.state.editUser.id === this.props.user.id) {
      return <div>You cannot edit your own account</div>;
    }

    return (
      <div>
        <div className="project-status">
          <h4>Details for {this.state.editUser.login}</h4>
          <UserDetails user={this.state.editUser} />

          <h4>Settings for {this.state.editUser.login}</h4>
          <UserProperties user={this.state.editUser} />

          <ul>
            <li>Uploaded subjects: {this.state.editUser.uploaded_subjects_count}</li>
            <li><UserLimitToggle editUser={this.state.editUser} /></li>
          </ul>

          <DeleteUser user={this.state.editUser} />
        </div>
        <br />
        <UserResources type="projects" user={this.state.editUser} />
        <UserResources type="organizations" user={this.state.editUser} />
      </div>
    );
  }
}

UserSettings.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string
  }),
  user: PropTypes.shape({
    id: PropTypes.string
  })
};

UserSettings.defaultProps = {
  params: {},
  user: null
};

export default UserSettings;
