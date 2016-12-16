import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

import LoadingIndicator from '../../components/loading-indicator';
import UserSearch from '../../components/user-search';
import UserSettings from './user-settings';
import UserProjects from './user-settings/projects';

class UserSettingsList extends Component {
  constructor(props) {
    super(props);
    this.listUsers = this.listUsers.bind(this);
    this.state = {
      userId: null,
      editUser: null
    };
  }

  getEditUser(userId) {
    apiClient.type('users').get(userId).then(
      editUser => this.setState({ editUser })
    );
  }

  listUsers(e) {
    e.preventDefault();
    const userSelect = this.list.querySelector('[name="userids"]');
    const userId = userSelect.value;

    if (userId) {
      this.getEditUser(userId);
      this.setState({ userId });
    }
  }

  userResults() {
    if (!this.state.userId) {
      return;
    }

    if (!this.state.editUser) {
      return <LoadingIndicator />;
    }

    if (this.state.editUser === this.props.user) {
      return <p>Can&apos;t edit your own account</p>;
    }

    return (
      <div>
        <UserSettings editUser={this.state.editUser} />
        <UserProjects user={this.state.editUser} />
      </div>
    );
  }

  render() {
    return (
      <div ref={list => this.list = list}>
        <div className="columns-container">
          <div className="column">
            <UserSearch multi={false} />
          </div>
          <button type="button" onClick={this.listUsers}>
            Find user
          </button>
        </div>
        {this.userResults()}
      </div>
    );
  }
}

export default UserSettingsList;
