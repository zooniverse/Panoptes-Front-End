import PropTypes from 'prop-types';
import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

import UserDetails from './user-settings/details';
import UserProperties from './user-settings/properties';
import UserResources from './user-settings/resources';
import UserLimitToggle from './user-settings/limit-toggle';
import DeleteUser from './user-settings/delete-user';
import { getUserProjects } from './user-settings/stats';

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.boundForceUpdate = this.forceUpdate.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUserProjects = this.updateUserProjects.bind(this);

    this.state = {
      editUser: null,
      ribbonData: [],
      totalClassifications: 0
    };
  }

  componentDidMount() {
    this.getUser();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editUser?.id !== prevState.editUser?.id) {
      getUserProjects(this.state.editUser, this.updateUserProjects)
    }
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

  updateUserProjects(projects) {
    this.setState((prevState) => {
      const ribbonData = prevState.ribbonData.concat(projects);
      const totalClassifications = ribbonData
      .reduce((total, project) => {
        return total + project.classifications;
      }, 0);
      return { ribbonData, totalClassifications };
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
        <h4>Classification history</h4>
        <p>Total classifications: {this.state.totalClassifications}</p>
        <ul>
        {this.state.ribbonData.map(project => (
          <li key={project.id}>
            <p><b>{project.display_name}</b><br/>
              Classifications: {project.classifications}
            </p>
          </li>
        ))}
        </ul>
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
