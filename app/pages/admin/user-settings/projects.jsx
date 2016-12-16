import React, { Component } from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';

class Projects extends Component {
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
    return apiClient.type('projects').get({ owner: login, cards: true }).then(
      projects => this.setState({ projects })
    );
  }

  projectLink(project) {
    return (
      <li key={project.id}>
        <Link to={`/projects/${project.slug}`}>
          {project.display_name}
        </Link>
      </li>
    );
  }

  render() {
    return (
      <div>
        <h3>Projects</h3>
        <ul>
          {this.state.projects.map(project => this.projectLink(project))}
        </ul>
      </div>
    );
  }
}

Projects.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default Projects;
