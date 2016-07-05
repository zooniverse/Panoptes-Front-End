import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

const ProjectStats = React.createClass({
  propTypes: {
    projectID: React.PropTypes.string,
    onClose: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      projectID: '',
      onClose: () => {},
    };
  },

  getInitialState() {
    return {
      data: {},
      loading: false,
      error: null,
    };
  },

  componentDidMount() {
    this.fetchProject(this.props.projectID);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectID !== this.props.projectID) {
      this.fetchProject(nextProps.projectID);
    }
  },

  fetchProject(projectID) {
    this.setState({
      loading: true,
      error: null,
    });

    apiClient.type('projects').get(projectID)
    .then((project) => {
      this.setState({
        project: project,
      });
    })
    .catch((error) => {
      this.setState({
        error: error,
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
      <div className="user-home-page-project-stats">
        <button type="button" onClick={this.props.onClose}></button>
        {this.state.loading && (
          <div>Loading...</div>
        )}
        {!!this.state.project && (
          <div>
            <div>{this.state.project.id}</div>
            <div>{this.state.project.display_name}</div>
          </div>
        )}
      </div>
    );
  },
});

export default ProjectStats;
