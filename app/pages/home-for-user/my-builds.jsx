import PropTypes from 'prop-types';
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import HomePageSection from './generic-section';
import { Link } from 'react-router';
import ProjectCard from '../../partials/project-card';

class MyBuildsSection extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  static contextTypes = {
    user: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onClose: () => {},
  };

  state = {
    loading: false,
    error: null,
    projects: [],
    avatars: {},
  };

  componentDidMount() {
    this.fetchProjects(this.context.user);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.user !== this.context.user) {
      this.fetchProjects(nextContext.user);
    }
  }

  fetchProjects = () => {
    this.setState({
      loading: true,
      error: null,
      avatars: {},
    });

    apiClient.type('projects').get({
      current_user_roles: ['owner'],
      sort: '-updated_at',
      include: ['avatar']
    })
    .then((projects) => {
      this.setState({
        projects,
      });
      return projects.map(project => project.links.avatar.id || null)
        .filter(value => value !== null);
    })
    .then((projectAvatarIds) => {
      if (projectAvatarIds.length > 0) {
        apiClient.type('avatars').get(projectAvatarIds)
          .then((avatars) => {
            const newState = Object.assign({}, this.state.avatars);
            avatars.map((avatar) => newState[avatar.links.linked.id] = avatar);
            this.setState({
              avatars: newState,
            });
          })
          .catch(error => console.error('Error getting project avatars', avatars));
      }
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
  };

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
  }
}

export default MyBuildsSection;