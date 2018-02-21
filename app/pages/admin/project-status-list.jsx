import React, { Component } from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import LoadingIndicator from '../../components/loading-indicator';
import ProjectIcon from '../../components/project-icon';
import Paginator from '../../talk/lib/paginator';

class ProjectStatusList extends Component {
  constructor(props) {
    super(props);
    this.getProjects = this.getProjects.bind(this);
    this.renderProjectList = this.renderProjectList.bind(this);
    this.renderProjectListItem = this.renderProjectListItem.bind(this);
    this.state = {
      loading: false,
      projects: [],
      error: null
    };
  }

  componentWillMount() {
    this.getProjects();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.query !== this.props.location.query) {
      this.getProjects();
    }
  }

  getProjects() {
    const { query } = this.props.location;

    const projectsQuery = {
      include: 'avatar',
      sort: '-updated_at'
    };

    if (query && query.filterBy && !query.slug) {
      projectsQuery[query.filterBy] = true;
    }
    const mergedQuery = Object.assign({}, projectsQuery, query);

    this.setState({ loading: true, error: null });
    return apiClient.type('projects').get(mergedQuery)
      .then((projects) => { this.setState({ projects, loading: false }); })
      .catch((error) => { this.setState({ error: `Error requesting projects:, ${error}`, loading: false }); });
  }

  renderProjectList() {
    const { projects } = this.state;
    let meta = {};
    if (projects.length > 0) {
      meta = projects[0].getMeta();
    }

    return (projects.length === 0)
      ? <div className="project-status-list">No projects found for this filter</div>
      : <div>
          <div className="project-status-list">
            {projects.map(project => this.renderProjectListItem(project))}
          </div>
          <Paginator page={meta.page} pageCount={meta.page_count} />
        </div>
  }

  renderProjectListItem(project) {
    const [owner, name] = project.slug.split('/');
    return (
      <div key={project.id}>
        <ProjectIcon linkTo={`/admin/project_status/${owner}/${name}`} project={project} />
      </div>
    );
  }

  render() {
    return (
      <div className="project-status-page">
        <nav className="project-status-filters">
          <Link to="/admin/project_status">All</Link>
          <Link to="/admin/project_status?filterBy=launch_approved">Launch Approved</Link>
          <Link to="/admin/project_status?filterBy=launch_requested">Launch Requested</Link>
          <Link to="/admin/project_status?filterBy=beta_approved">Beta Approved</Link>
          <Link to="/admin/project_status?filterBy=beta_requested">Beta Requested</Link>
        </nav>
        {(this.state.error) ? <p>{this.state.error}</p> : null}
        {(this.state.loading) ? <LoadingIndicator /> : this.renderProjectList()}
      </div>
    );
  }
}

export default ProjectStatusList;
