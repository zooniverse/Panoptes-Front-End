import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import PropTypes from 'prop-types';
import LoadingIndicator from '../../components/loading-indicator';
import ProjectIcon from '../../components/project-icon';
import Paginator from '../../talk/lib/paginator';
import SearchSelector from '../projects/projects-search-selector';

function navigateToProject(option) {
  const projectUrl = option.value;
  if (projectUrl.match(/^http.*/)) {
    window.location.assign(projectUrl);
  } else {
    browserHistory.push(['/admin/project_status', projectUrl].join('/'));
  }
}

function renderProjectListItem(project) {
  const [owner, name] = project.slug.split('/');
  return (
    <div key={project.id}>
      <ProjectIcon linkTo={`/admin/project_status/${owner}/${name}`} project={project} />
    </div>
  );
}

class ProjectStatusList extends Component {
  constructor(props) {
    super(props);
    this.getProjects = this.getProjects.bind(this);
    this.renderProjectList = this.renderProjectList.bind(this);
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
    const { location: { query }} = this.props;
    if (prevProps.location.query !== query) {
      this.getProjects();
    }
  }

  getProjects() {
    const { location: { query }} = this.props;

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

    return (projects.length === 0) ? <div className="project-status-list">No projects found for this filter</div> :
      (
        <div>
          <div className="project-status-list">
            {projects.map(project => renderProjectListItem(project))}
          </div>
          <Paginator page={meta.page} pageCount={meta.page_count} />
        </div>
      );
  }

  render() {
    const { error, loading } = this.state;

    return (
      <div className="project-status-page">
        <SearchSelector onChange={navigateToProject} />
        <nav className="project-status-filters">
          <Link to="/admin/project_status">All</Link>
          <Link to="/admin/project_status?filterBy=launch_approved">Launch Approved</Link>
          <Link to="/admin/project_status?filterBy=launch_requested">Launch Requested</Link>
          <Link to="/admin/project_status?filterBy=beta_approved">Beta Approved</Link>
          <Link to="/admin/project_status?filterBy=beta_requested">Beta Requested</Link>
        </nav>
        {(error) ? <p>{error}</p> : null}
        {(loading) ? <LoadingIndicator /> : this.renderProjectList()}
      </div>
    );
  }
}

ProjectStatusList.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape()
  })
};

ProjectStatusList.defaultProps = {
  location: {}
};

export default ProjectStatusList;
