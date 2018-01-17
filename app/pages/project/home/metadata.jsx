import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import TalkStatus from './talk-status';

class ProjectMetadataStat extends React.Component {
  render() {
    return (
      <div className="project-metadata-stat">
        <div className="project-metadata-stat__value">{this.props.value}</div>
        <div className="project-metadata-stat__label">{this.props.children}</div>
      </div>
    );
  }
}

ProjectMetadataStat.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
};

export default class ProjectMetadata extends React.Component {
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

  renderStatus() {
    const percentComplete = this.props.project.completeness;

    return (
      <div className="project-metadata-status-bar">
        <svg width="100%" height="1em" viewBox="0 0 1 1" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="linear-gradient">
              <stop offset="14%" stopColor="#E45950" />
              <stop offset="79%" stopColor="#F0B200" />
            </linearGradient>
          </defs>
          <rect fill="url(#linear-gradient)" stroke="none" x="0" y="0" width={percentComplete} height="1" />
          <rect fill="hsl(0, 0%, 75%)" stroke="none" x={percentComplete} y="0" width={1 - percentComplete} height="1" />
        </svg>
        <br />
        {Math.floor(percentComplete * 100)}% Complete
      </div>
    );
  }

  render() {
    const { project, translation } = this.props;
    const statsLink = `/projects/${project.slug}/stats`;

    return (
      <div className="project-home-page__container">
        <div className="project-metadata">
          <Link to={statsLink}>
            <Translate
              content="project.home.metadata.statistics"
              with={{ title: translation.display_name }}
            />
          </Link>

          {this.renderStatus()}

          <div className="project-metadata-stats">
            <ProjectMetadataStat value={project.classifiers_count.toLocaleString()}>
              <Translate content="project.home.metadata.volunteers" />
            </ProjectMetadataStat>
            <ProjectMetadataStat value={this.state.classificationsCount.toLocaleString()}>
              <Translate content="project.home.metadata.classifications" />
            </ProjectMetadataStat>
            <ProjectMetadataStat value={project.subjects_count.toLocaleString()}>
              <Translate content="project.home.metadata.subjects" />
            </ProjectMetadataStat>
            <ProjectMetadataStat value={project.retired_subjects_count.toLocaleString()}>
              <Translate content="project.home.metadata.completedSubjects" />
            </ProjectMetadataStat>
          </div>

        </div>
        {this.props.showTalkStatus && (
          <TalkStatus
            project={this.props.project}
            translation={this.props.translation}
          />
        )}
      </div>
    );
  }
}

ProjectMetadata.contextTypes = {
  pusher: PropTypes.object,
};

ProjectMetadata.propTypes = {
  project: PropTypes.shape({
    classifications_count: PropTypes.number,
    completeness: PropTypes.number,
    display_name: PropTypes.string,
    id: PropTypes.id,
    slug: PropTypes.string,
  }),
  showTalkStatus: PropTypes.bool,
  translation: PropTypes.shape({
    description: PropTypes.string,
    display_name: PropTypes.string,
    introduction: PropTypes.string,
    researcher_quote: PropTypes.string,
    title: PropTypes.string
  }).isRequired
};

ProjectMetadata.defaultProps = {
  project: {},
  showTalkStatus: false,
};