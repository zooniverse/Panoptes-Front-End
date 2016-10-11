import React from 'react';
import { Link } from 'react-router';

class ProjectMetadata extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classificationsCount: this.props.project.classifications_count,
    };
  }

  componentDidMount() {
    const channel = this.context.pusher.subscribe('panoptes');
    channel.bind('classification', (data) => {
      if (data.project_id === this.props.project.id) {
        this.setState({ classificationsCount: this.state.classificationsCount + 1 });
      }
    });
  }

  render() {
    const project = this.props.project;
    const statsLink = `/projects/${project.slug}/stats`;

    return (
      <div className="project-metadata content-container">
        <div className="project-metadata-header">
          <span>{project.display_name}</span>{' '}
          <Link to={statsLink}>
            <span>Statistics</span>
          </Link>
        </div>

        <div className="project-metadata-stats">
          <div className="project-metadata-stat">
            <div>{project.classifiers_count.toLocaleString()}</div>
            <div>Registered Volunteers</div>
          </div>

          <div className="project-metadata-stat">
            <div>{this.state.classificationsCount.toLocaleString()}</div>
            <div>Classifications</div>
          </div>

          <div className="project-metadata-stat">
            <div>{project.subjects_count.toLocaleString()}</div>
            <div>Subjects</div>
          </div>

          <div className="project-metadata-stat">
            <div>{project.retired_subjects_count.toLocaleString()}</div>
            <div>Retired Subjects</div>
          </div>
        </div>
      </div>
    );
  }
}

ProjectMetadata.contextTypes = {
  pusher: React.PropTypes.object,
};

ProjectMetadata.propTypes = {
  project: React.PropTypes.object,
};

ProjectMetadata.defaultProps = {
  project: null,
};

export default ProjectMetadata;

