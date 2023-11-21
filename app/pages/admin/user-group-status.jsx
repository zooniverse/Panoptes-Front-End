import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import moment from 'moment';

import LoadingIndicator from '../../components/loading-indicator';

class UserGroupStatus extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      userGroup: null,
      error: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getUserGroup();
  }

  getUserGroup() {
    const { id } = this.props.params;

    this.setState({ loading: true, error: null });
    return apiClient.type('user_groups').get(id)
      .then((userGroup) => {
        this.setState({ userGroup, loading: false });
      })
      .catch((error) => { this.setState({ error: `Error requesting userGroup:, ${error}`, loading: false }); });
  }

  handleInputChange(event) {
    this.setState({ error: null, loading: true });

    const change = {};
    change[event.target.name] = event.target.checked;

    this.state.userGroup.update(change).save()
      .catch(error => this.setState({ error, loading: false }))
      .then(() => {
        this.getUserGroup()
        this.setState({ error: null, loading: false });
      });
  }

  renderError() {
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }

    const { userGroup } = this.state;

    if (!userGroup) {
      return <div>User Group not found</div>;
    }

    return (
      <div className="project-status">
        <Link to={`/groups/${userGroup.id}`}>{`${userGroup.display_name} - ${userGroup.id}`}</Link>
        <div className="project-status__section">
          <h4>Information</h4>
          <ul>
            <li>ID: {userGroup.id}</li>
            <li>Display Name: {userGroup.display_name}</li>
            <li>Name: {userGroup.name}</li>
            <li>Created: {moment(userGroup.created_at).format('MMMM Do YYYY, h:mm:ss a')}</li>
            <li>Updated: {moment(userGroup.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</li>
            <li>Join Token: {userGroup.join_token}</li>
          </ul>
          <h4>Visibility Settings</h4>
          <ul>
            <li>Stats Visibility: {userGroup.stats_visibility}</li>
            <li>🚧 input to change stats visibility coming soon... 🚧</li>
          </ul>
        </div>
      </div>
    );
  }
}

UserGroupStatus.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string
  })
};

export default UserGroupStatus;
