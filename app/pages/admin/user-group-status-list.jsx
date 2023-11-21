import React, { Component } from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';

import SearchSelector from './user-group-search-selector';
import LoadingIndicator from '../../components/loading-indicator';
import Paginator from '../../talk/lib/paginator';

class UserGroupStatusList extends Component {
  constructor(props) {
    super(props);
    this.getUserGroups = this.getUserGroups.bind(this);
    this.renderUserGroupList = this.renderUserGroupList.bind(this);
    this.renderUserGroupListItem = this.renderUserGroupListItem.bind(this);
    this.state = {
      loading: false,
      userGroups: [],
      error: null
    };
  }

  componentDidMount() {
    this.getUserGroups();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.query !== this.props.location.query) {
      this.getUserGroups();
    }
  }

  getUserGroups() {
    const { query } = this.props.location;

    this.setState({ loading: true, error: null });
    return apiClient.type('user_groups').get(query)
      .then((userGroups) => { this.setState({ userGroups, loading: false }); })
      .catch((error) => { this.setState({ error: `Error requesting userGroups:, ${error}`, loading: false }); });
  }

  renderUserGroupList() {
    const { userGroups } = this.state;
    let meta = {};
    if (userGroups.length > 0) {
      meta = userGroups[0].getMeta();
    }

    return (userGroups.length === 0) ?
      <div className="project-status-list">No user groups found for this filter</div> :
      <div>
        <h4 style={{ marginLeft: '20px' }}>Display Name - ID</h4>
        <menu>
          {userGroups.map(userGroup => this.renderUserGroupListItem(userGroup))}
        </menu>
        <Paginator page={meta.page} pageCount={meta.page_count} />
      </div>;
  }

  renderUserGroupListItem(userGroup) {
    return (
      <li key={userGroup.id}>
        <Link to={`/admin/user-group-status/${userGroup.id}`}>
          <span>{userGroup.display_name} - {userGroup.id}</span>
        </Link>
      </li>
    )
  }

  render() {
    return (
      <div className="project-status-page">
        <SearchSelector className="project-status-search" />
        {(this.state.error) ? <p>{this.state.error}</p> : null}
        {(this.state.loading) ? <LoadingIndicator /> : this.renderUserGroupList()}
      </div>
    );
  }
}

export default UserGroupStatusList;
