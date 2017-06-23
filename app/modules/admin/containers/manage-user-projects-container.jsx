import React, { Component, PropTypes } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import ManageUserProjects from '../components/manage-user-projects';

class ManageUserProjectsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    this.updateProjects(this.props.user.login);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user !== this.props.user) {
      this.updateProjects(newProps.user.login);
    }
  }

  updateProjects(login) {
    return apiClient.type('projects').get({ owner: login, cards: true })
      .then(projects => this.setState({ projects }))
      .catch(error => console.error(error));
  }

  render() {
    return (<ManageUserProjects projects={this.state.projects} />);
  }
}

ManageUserProjectsContainer.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ManageUserProjectsContainer;
