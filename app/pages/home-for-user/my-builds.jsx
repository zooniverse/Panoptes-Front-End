import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import HomePageSection from './generic-section';
import { Link } from 'react-router';
import ProjectCard from '../../partials/project-card';

const MyBuildsSection = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func.isRequired,
  },

  contextTypes: {
    user: React.PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      onClose: () => {},
    };
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

  fetchProjects() {
    this.setState({
      loading: true,
      error: null,
      avatars: {},
    });

    apiClient.type('projects').get({
      current_user_roles: ['owner'],
      sort: '-updated_at',
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
          const newState = Object.assign({}, this.state.avatars);
          newState[project.id] = avatar;
          this.setState({
            avatars: newState,
          });
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
        title="My builds"
        loading={this.state.loading}
        error={this.state.error}
        onClose={this.props.onClose}
      >
        <div className="home-page-section__sub-header">
          <Link to="/lab" className="outlined-button">See all</Link>
        </div>

        {this.state.projects.length === 0 && (
          <div className="home-page-section__header-label">
            <p> You have no builds. </p>
          </div>
        )}

        <div className="project-card-list">
          {this.state.projects.map((project) => {
            const avatarSrc = !!this.state.avatars[project.id] ? this.state.avatars[project.id].src : null;
            return <ProjectCard key={project.id} project={project} imageSrc={avatarSrc} href={`/lab/${project.id}`} />;
          })}
        </div>
      </HomePageSection>
    );
  },
});

export default MyBuildsSection;
