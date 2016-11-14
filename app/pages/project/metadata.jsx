import React from 'react';
import { Link } from 'react-router';

class ProjectMetadataStat extends React.Component {
  render() {
    return (
      <div className="project-metadata-stat">
        <div className="project-metadata-stat__value">{this.props.value}</div>
        <div className="project-metadata-stat__label">{this.props.label}</div>
      </div>
    );

  }
}

ProjectMetadataStat.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
}

class ProjectMetadata extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      classificationsCount: props.project.classifications_count,
    };
  }

  componentDidMount() {
    if (this.context.pusher) {
      const channel = this.context.pusher.subscribe('panoptes');
      channel.bind('classification', (data) => {
        if (data.project_id === this.props.project.id) {
          this.setState({ classificationsCount: this.state.classificationsCount + 1 });
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.context.pusher) {
      this.context.pusher.unsubscribe('panoptes');
    }
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
          <ProjectMetadataStat label="Volunteers" value={project.classifiers_count.toLocaleString()}  />
          <ProjectMetadataStat label="Classifications" value={this.state.classificationsCount.toLocaleString()} />
          <ProjectMetadataStat label="Subjects" value={project.subjects_count.toLocaleString()} />
          <ProjectMetadataStat label="Completed Subjects" value={project.retired_subjects_count.toLocaleString()}  />
        </div>
      </div>
    );
  }
}

ProjectMetadata.contextTypes = {
  pusher: React.PropTypes.object,
};

ProjectMetadata.propTypes = {
  project: React.PropTypes.object.isRequired,
};

ProjectMetadata.defaultProps = {
  project: {},
};

export default ProjectMetadata;
