import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import Heading from 'grommet/components/Heading';

import LoadingIndicator from '../../../components/loading-indicator';
import UserSearch from '../../../components/user-search';
import ManageUserSettings from '../components/manage-user-settings';
import ManageUserProjects from './manage-user-projects-container';

class ManageUserContainer extends Component {
  constructor(props) {
    super(props);
    this.listUsers = this.listUsers.bind(this);
    this.state = {
      userId: null,
      editUser: null
    };
  }

  getEditUser(userId) {
    apiClient.type('users').get(userId)
      .then(editUser => this.setState({ editUser }))
      .catch(error => console.error(error));
  }

  listUsers(e) {
    e.preventDefault();
    const userId = this.userSearch.value().value;

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
        <ManageUserSettings editUser={this.state.editUser} />
        <ManageUserProjects user={this.state.editUser} />
      </div>
    );
  }

  render() {
    return (
      <div ref={list => this.list = list}>
        <Heading tag="h2">Manage User { (this.state.editUser) && <span> &ndash; {this.state.editUser.login}</span> } </Heading>
        <div className="columns-container">
          <div className="column">
            <UserSearch 
              ref={component => { this.userSearch = component; }} 
              multi={false} 
            />
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

export default ManageUserContainer;
