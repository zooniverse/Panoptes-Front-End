import PropTypes from 'prop-types';
import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import LoadingIndicator from '../../components/loading-indicator';
import ProfileUser from './user';

class UserProfilePage extends Component {
  constructor(props) {
    super(props);
    this.getUser = this.getUser.bind(this);
    this.state = {
      loading: true,
      profileUser: null
    };
  }

  componentDidMount() {
    this.getUser(this.props.params.profile_name);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.profile_name !== this.props.params.profile_name) {
      this.getUser(nextProps.params.profile_name);
    }
  }

  getUser(login) {
    this.setState({ loading: true });

    apiClient.type('users').get({ login }).then((users) => {
      this.setState({ profileUser: users[0], loading: false });
    }).catch(() => {
      this.setState({ loading: false, profileUser: null });
    });
  }

  render() {
    if (this.state.profileUser) {
      return <ProfileUser {...this.props} profileUser={this.state.profileUser} user={this.props.user} />;
    } else if (this.state.loading) {
      return (
        <div className="centered-grid">
          <LoadingIndicator />
        </div>
      );
    } else {
      return (
        <div className="centered-grid">
          <p>User <strong>{this.props.params.profile_name}</strong> not found</p>
        </div>
      );
    }
  }
}

UserProfilePage.propTypes = {
  user: PropTypes.object
};

export default UserProfilePage;