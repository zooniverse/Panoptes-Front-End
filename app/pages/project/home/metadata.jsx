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
  children: React.PropTypes.node.isRequired,
  value: React.PropTypes.string.isRequired,
};

export default class ProjectMetadata extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      classificationsCount: props.project.classifications_count,
      channel: null
    };

    this.incrementClassificationsCounter = this.incrementClassificationsCounter.bind(this)
  }

  componentDidMount() {
    let channel = this.context.comms.join("project:" + this.props.project.id);
    channel.on("classification", this.incrementClassificationsCounter);
    this.setState({channel: channel});
  }

  componentWillUnmount() {
    if (this.state.channel) {
      this.state.channel.off("classification", this.incrementClassificationsCounter);
      this.context.comms.leave("project:" + this.props.project.id);
      this.setState({channel: null});
    }
  }

  incrementClassificationsCounter() {
    this.setState({ classificationsCount: this.state.classificationsCount + 1 });
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
    const project = this.props.project;
    const statsLink = `/projects/${project.slug}/stats`;

    return (
      <div className="project-home-page__container">
        <div className="project-metadata">
          <Link to={statsLink}>
            <Translate
              content="project.home.metadata.statistics"
              with={{ title: project.display_name }}
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
          <TalkStatus project={this.props.project} />
        )}
      </div>
    );
  }
}

ProjectMetadata.contextTypes = {
  comms: React.PropTypes.object,
};

ProjectMetadata.propTypes = {
  project: React.PropTypes.shape({
    classifications_count: React.PropTypes.number,
    completeness: React.PropTypes.number,
    display_name: React.PropTypes.string,
    id: React.PropTypes.id,
    slug: React.PropTypes.string,
  }),
  showTalkStatus: React.PropTypes.bool,
};

ProjectMetadata.defaultProps = {
  project: {},
  showTalkStatus: false,
};
