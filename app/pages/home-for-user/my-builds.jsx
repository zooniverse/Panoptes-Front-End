import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import HomePageSection from './generic-section';
import { Link } from 'react-router';

const MyBuildsSection = React.createClass({
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

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.user !== this.context.user) {
      this.fetchProjects(nextContext.user);
    }
  },

  fetchProjects() {
    this.setState({
      loading: true,
      error: null,
    });

    apiClient.type('projects').get({
      current_user_roles: ['owner', 'workaround'],
      sort: '-updated_at',
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
        title="My builds"
        loading={this.state.loading}
        error={this.state.error}
        onClose={this.props.onClose}
      >
        <div className="home-page-section__sub-header">
          <Link to={`/lab`} className="outlined-button">See all</Link>
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

export default MyBuildsSection;
