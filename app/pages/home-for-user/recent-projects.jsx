import React from 'react';
import HomePageSection from './generic-section';
import { Link } from 'react-router';

const RecentProjectsSection = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
  },

  contextTypes: {
    user: React.PropTypes.object,
  },

  getInitialState() {
    return {
      loading: false,
      error: null,
      projects: [],
    };
  },

  componentDidMount() {
    this.fetchProjects(this.context.user);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.context.user) {
      this.fetchProjects(nextProps.user);
    }
  },

  fetchProjects(user) {
    this.setState({
      loading: true,
      error: null,
    });

    user.get('project_preferences', {
      page_size: 8,
      sort: '-updated_at',
    })
    .then((preferences) => {
      return Promise.all(preferences.map((preference) => {
        // A user might have preferences for a project that no longer exists.
        return preference.get('project').catch(() => {
          return null;
        });
      })).then((projects) => {
        return projects.filter(Boolean);
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
        {this.state.projects.map((project) => {
          return (
            <div key={project.id}>
              {project.id}: {project.display_name}
            </div>
          );
        })}
      </HomePageSection>
    );
  },
});

export default RecentProjectsSection;
