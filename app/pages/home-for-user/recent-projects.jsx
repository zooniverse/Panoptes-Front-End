import React from 'react';
import HomePageSection from './generic-section';
import { Link } from 'react-router';
import ProjectCard from '../../partials/project-card';

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

      return Promise.all(projects.map((project) => {
        return project.get('avatar')
        .catch(() => {
          return null;
        })
        .then((avatar) => {
          this.state.avatars[project.id] = avatar;
          this.forceUpdate();
        });
      }));
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

        <div className="project-card-list">
          {this.state.projects.map((project) => {
            const avatarSrc = !!this.state.avatars[project.id] ? this.state.avatars[project.id].src : null;
            return <ProjectCard key={project.id} project={project} imageSrc={avatarSrc} />;
          })}
        </div>
      </HomePageSection>
    );
  },
});

export default RecentProjectsSection;
