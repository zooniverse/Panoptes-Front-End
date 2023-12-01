import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import UserGroupSearchSelector from './user-group-search-selector';

class UserGroupStatusList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userGroup: null
    };

    this.handleUserGroupSearchChange = this.handleUserGroupSearchChange.bind(this);
    this.navigateToUserGroup = this.navigateToUserGroup.bind(this);
  }

  handleUserGroupSearchChange = (userGroupOption) => {
    if (userGroupOption) {
      this.setState({ userGroup: userGroupOption });
    } else {
      this.setState({ userGroup: null });
    }
  }

  navigateToUserGroup(event) {
    event.preventDefault();

    const userGroupID = this.state.userGroup.value;
    browserHistory.push(['/admin/user-group-status', userGroupID].join('/'));
  }

  render() {
    return (
      <div className="columns-container">
        <div className="column">
          <UserGroupSearchSelector
            handleUserGroupSearchChange={this.handleUserGroupSearchChange}
            userGroup={this.state.userGroup}
          />
        </div>
        <button
          type="button"
          onClick={this.navigateToUserGroup}
        >
          Edit user_group
        </button>
      </div>
    );
  }
}

export default UserGroupStatusList;
