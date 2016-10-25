import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import BlurredImage from './blurred-image';

const ProjectStats = React.createClass({
  propTypes: {
    projectID: React.PropTypes.string.isRequired,
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
      project: {},
      backgroundSrc: null,
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

      return project.get('background')
      .catch(() => {
        return null;
      })
      .then((background) => {
        this.setState({
          backgroundSrc: background.src,
        });
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
      <div className="home-page-project-stats" style={{ position: 'relative', zIndex: 1 }}>
        {this.state.background !== null && (
          <BlurredImage className="home-page-for-user__background" src={this.state.backgroundSrc} blur="0.5em" position="50% 33%" />
        )}

        <div className="home-page-project-stats__content">
          <a href="#">×</a>
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
