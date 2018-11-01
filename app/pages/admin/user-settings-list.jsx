import PropTypes from 'prop-types';
import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

import LoadingIndicator from '../../components/loading-indicator';
import UserSearchAdmin from '../../components/user-search-admin';

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
    const userId = this.userSearch.value().value;

    if (userId) {
      this.context.router.push(`/admin/users/${userId}`);
    }
  }

  userResults() {
    if (!this.state.userId) {
      return;
    }

    if (!this.state.editUser) {
      return <LoadingIndicator />;
    }
  }

  render() {
    return (
      <div ref={list => this.list = list}>
        <div className="columns-container">
          <div className="column">
            <UserSearchAdmin
              ref={(component) => { this.userSearch = component; }}
              multi={false}
              isAdminUser={this.props.user.admin}
              debounce={300}
            />
          </div>
          <button type="button" onClick={this.listUsers}>
            Edit user
          </button>
        </div>
        {this.userResults()}
      </div>
    );
  }
}

UserSettingsList.contextTypes = {
  router: PropTypes.object.isRequired
};

export default UserSettingsList;
