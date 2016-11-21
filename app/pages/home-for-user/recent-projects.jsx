import React from 'react';
import HomePageSection from './generic-section';
import { Link } from 'react-router';
import ProjectCard from '../../partials/project-card';
import apiClient from 'panoptes-client/lib/api-client';

const RecentProjectsSection = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
  },

  contextTypes: {
    user: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      loading: false,
      error: null,
      projects: [],
      avatars: {},
    };
  },

  componentDidMount() {
    this.fetchProjects(this.context.user);
  },

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.user !== this.context.user) {
      this.fetchProjects(nextContext.user);
    }
  },

  fetchProjects(user) {
    this.setState({
      loading: true,
      error: null,
      avatars: {},
    });

    user.get('project_preferences', {
      sort: '-updated_at',
    })
    .then((preferences) => {
      const activePreferences = preferences.filter((projectPreference) => {
        return projectPreference.activity_count > 0;
      });
      const recentPreferences = activePreferences.filter(Boolean).slice(0, 5);
      const project_ids = recentPreferences.map((preference) => {
        return preference.links.project
      });
      return apiClient.type('projects').get({id: project_ids, cards: true}).catch(() => {
        return null;
      });
    })
    .then((projects) => {
      this.setState({
        projects,
      });
    })
    .catch((error) => {
      this.setState({
        error: error,
        projects: [],
      });
    })
    .then(() => {
      this.setState({
        loading: false,
      });
    });
  },

  render() {
    return (
      <HomePageSection
        title="Recent projects"
        loading={this.state.loading}
        error={this.state.error}
        onClose={this.props.onClose}
      >
        <div className="home-page-section__sub-header">
          <Link to={`/users/${this.context.user.login}/stats`} className="outlined-button">See all</Link>
        </div>

        {this.state.projects.length === 0 && (
          <div className="home-page-section__header-label">
            <p> You have no recent projects. </p>
          </div>
        )}

        <div className="project-card-list">
          {this.state.projects.map((project) => {
            return <ProjectCard key={project.id} project={project} />;
          })}
        </div>
      </HomePageSection>
    );
  },
});

export default RecentProjectsSection;
