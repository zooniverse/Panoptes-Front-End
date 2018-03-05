import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import moment from 'moment';

import ProjectIcon from '../../components/project-icon';
import LoadingIndicator from '../../components/loading-indicator';
import LAB_APP_URL from '../../lib/lab-app-url';

class OrganizationStatus extends Component {
  constructor(props) {
    super(props);
    this.getProjects = this.getProjects.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      organization: null,
      projects: [],
      error: null,
      updating: false
    };
  }

  componentDidMount() {
    this.getOrganization().then(() => this.getProjects());
  }

  getOrganization() {
    const { owner, name } = this.props.params;
    const slug = `${owner}/${name}`;

    return apiClient.type('organizations').get({ slug })
      .then((organizations) => {
        const organization = organizations[0];
        this.setState({ organization });
        return organization;
      });
  }

  getProjects() {
    this.state.organization.get('projects', { sort: 'display_name' })
      .catch(error => console.error('error loading project', error)) // eslint-disable-line no-console
      .then((projects) => {
        this.setState({ projects });
      });
  }

  handleInputChange(event) {
    this.setState({ error: null, updating: true });

    const change = {};
    change[event.target.name] = event.target.checked;

    this.state.organization.update(change).save()
      .catch(error => this.setState({ error, updating: false }))
      .then(() => {
        this.getOrganization()
          .then(() => {
            this.getProjects();
            this.setState({ error: null, updating: false });
          });
      });
  }

  renderError() {
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }
  }

  renderProjects() {
    if (this.state.projects.length === 0) {
      return <div>No projects found</div>;
    }

    return (
      <ul className="project-status__section-list">
        {this.state.projects.map(project =>
          <li key={project.id} className="section-list__item">
            <Link to={`/admin/project_status/${project.slug}`}>{`${project.id} - ${project.display_name}`}</Link>
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
            <li>Id:{' '}
              <a href={`${LAB_APP_URL}/organizations/${this.state.organization.id}`}>
                {this.state.organization.id}
              </a>
            </li>
          </ul>
          <h4>Visibility Settings</h4>
          <ul className="project-status__section-list">
            <li>
              <label htmlFor="listed-true" style={{ whiteSpace: 'nowrap' }}>
                Listed:{' '}
                <input
                  name="listed"
                  type="checkbox"
                  checked={this.state.organization.listed}
                  disabled={this.state.updating}
                  onChange={this.handleInputChange}
                />
              </label>
            </li>
            <li>
              Listed At:{' '}
              {this.state.organization.listed ? moment(this.state.organization.listed_at).calendar() : 'N/A'}
            </li>
            <li>{this.renderError()}</li>
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

OrganizationStatus.propTypes = {
  params: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string
  })
};

export default OrganizationStatus;
