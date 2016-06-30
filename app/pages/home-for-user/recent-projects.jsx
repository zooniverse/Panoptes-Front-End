import React from 'react';

const RecentProjectsSection = React.createClass({
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
      page_size: 4,
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
        projects
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
      <div>
        {this.state.loading && <p>Loading...</p>}
        {this.state.projects.map((project) => {
          return <p>{project.display_name}</p>;
        })}
      </div>
    );
  },
});

export default RecentProjectsSection;
