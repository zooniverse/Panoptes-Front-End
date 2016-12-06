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
      page_size: 24,
      sort: '-updated_at',
    };

    if (query && query.filterBy && !query.slug) {
      projectsQuery[query.filterBy] = true;
    }

    this.setState({ loading: true });
    return apiClient.type('projects').get(projectsQuery)
      .then((projects) => this.setState({ projects, loading: false }))
      .catch((error) => console.error('Error requesting projects', error));
  }

  renderProjectList() {
    const { projects } = this.state;
    const meta = projects[0].getMeta() || {};
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
        <Link to={`/admin/project_status/${owner}/${name}`}>
          <ProjectIcon linkTo={false} project={project} />
        </Link>
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
        {(this.state.loading)
          ? <LoadingIndicator />
          : this.renderProjectList()
        }
      </div>
    );
  }
}

export default ProjectStatusList;
