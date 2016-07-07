import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import BlurredImage from './blurred-image';

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
      <div className="home-page-for-user__content" style={{ position: 'relative', zIndex: 1 }}>
        <BlurredImage className="home-page-for-user__background" src="//lorempixel.com/500/500/animals/2" blur="0.5em" position="50% 33%" />

        <div className="user-home-page-project-stats">
          <button type="button" onClick={this.props.onClose}>X</button>
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
      </div>
    );
  },
});

export default ProjectStats;
