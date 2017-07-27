import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import moment from 'moment';

import ProjectIcon from '../../components/project-icon';
import LoadingIndicator from '../../components/loading-indicator';

import Toggle from './project-status/toggle';

class OrganizationStatus extends Component {
  constructor(props) {
    super(props);
    this.forceUpdate = this.forceUpdate.bind(this);
    this.getProjects = this.getProjects.bind(this);

    this.state = {
      organization: null,
      error: null,
      projects: []
    };
  }

  componentDidMount() {
    this.getOrganization().then(() => this.getProjects());
  }

  componentWillUnmount() {
    this.state.organization.stopListening('change', this.forceUpdate);
  }

  getOrganization() {
    const { owner, name } = this.props.params;
    const slug = `${owner}/${name}`;

    return apiClient.type('organizations').get({ slug }).then((organizations) => {
      const organization = organizations[0];
      // TODO: We ought to improve this ChangeListener replacement
      organization.listen('change', this.forceUpdate);
      this.setState({ organization });
      return organization;
    });
  }

  getProjects() {
    this.state.organization.get('projects', { sort: 'display_name' })
      .then((projects) => {
        this.setState({ projects });
      });
  }

  renderProjects() {
    if (this.state.projects.length === 0) {
      return <div>No projects found</div>;
    }

    return (
      <ul className="project-status__section-list">
        {this.state.projects.map(project =>
          <li key={project.id} className="section-list__item">
            <span>{`${project.id} - ${project.display_name}`}</span>
            <ul className="project-status__section-list">
              <li className="project-status__org-project-list-item">
                Private: {project.private.toString()}
              </li>
              <li className="project-status__org-project-list-item">
                Live: {project.live.toString()}
              </li>
              <li className="project-status__org-project-list-item">
                Launch Approved: {project.launch_approved.toString()}
              </li>
            </ul>
          </li>
        )}
      </ul>);
  }

  render() {
    if (!this.state.organization) {
      return <LoadingIndicator />;
    }

    return (
      <div className="project-status">
        <ProjectIcon project={this.state.organization} linkTo={`/organizations/${this.state.organization.slug}`} />
        <div className="project-status__section">
          <h4>Information</h4>
          <ul>
            <li>Id: {this.state.organization.id}</li>
          </ul>
          <h4>Visibility Settings</h4>
          <ul className="project-status__section-list">
            <li>Listed: <Toggle project={this.state.organization} field="listed" /></li>
            <li>Listed At: {this.state.organization.listed ?
                moment(this.state.organization.listed_at).calendar() : 'N/A'}
            </li>
          </ul>
          <h4>Associated Projects</h4>
          <ul>
            {this.renderProjects()}
          </ul>
        </div>
      </div>
    );
  }
}

export default OrganizationStatus;
