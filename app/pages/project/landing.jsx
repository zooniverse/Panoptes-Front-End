import React from 'react';
import markdownz from 'markdownz';
import FinishedBanner from './finished-banner';
import TalkStatus from './talk-status';
import ProjectMetadata from './metadata';
import ProjectHomeWorkflowButtons from './home-workflow-buttons';

const Markdown = markdownz.Markdown;

export default class ProjectHomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showWorkflowButtons: false,
    };

    this.showWorkflowButtons = this.showWorkflowButtons.bind(this);
  }

  componentDidMount() {
    this.showWorkflowButtons();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.context.user !== nextContext.user) {
      this.showWorkflowButtons(nextProps, nextContext);
    }
  }

  showWorkflowButtons(props = this.props, context = this.context) {
    const workflowAssignment = this.props.project.experimental_tools.includes('workflow assignment');

    if ((props.project.configuration && props.project.configuration.user_chooses_workflow && !workflowAssignment) ||
      (workflowAssignment && context.user)) {
      this.setState({ showWorkflowButtons: true });
    } else {
      this.setState({ showWorkflowButtons: false });
    }
  }

  renderResearcherWords() {
    // TODO: Show researcher avatar selected from lab and researcher words
    const avatarSrc = '/assets/simple-avatar.png';

    return (
      <div className="project-home-page__researcher-words">
        <img role="presentation" src={avatarSrc} />

        <div>
          <h4>Words from the researcher</h4>
          <span>&quot;Here are some inspiring words about how much we need your help!&quot;</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="project-home-page">
        <div className="project-home-page__introduction">
          <FinishedBanner project={this.props.project} />

          <div className="project-home-page__description">{this.props.project.description}</div>

          <ProjectHomeWorkflowButtons
            activeWorkflows={this.props.activeWorkflows}
            onChangePreferences={this.props.onChangePreferences}
            preferences={this.props.preferences}
            project={this.props.project}
            showWorkflowButtons={this.state.showWorkflowButtons}
            workflowAssignment={this.props.project.experimental_tools.includes('workflow assignment')}
            splits={this.props.splits}
          />

        </div>

        <TalkStatus project={this.props.project} user={this.context.user} />

        <ProjectMetadata project={this.props.project} activeWorkflows={this.props.activeWorkflows} />

        <div className="project-home-page__section">
          {this.renderResearcherWords()}

          <div className="project-home-page__about-text">
            <h4>About {this.props.project.display_name}</h4>
            <Markdown project={this.props.project}>{this.props.project.introduction ? this.props.project.introduction : ''}</Markdown>
          </div>
        </div>

      </div>
    );
  }
}

ProjectHomePage.contextTypes = {
  geordi: React.PropTypes.object,
  user: React.PropTypes.object,
};

ProjectHomePage.defaultProps = {
  activeWorkflows: [],
  onChangePreferences: () => {},
  preferences: {},
  project: {},
  splits: {},
};

ProjectHomePage.propTypes = {
  activeWorkflows: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChangePreferences: React.PropTypes.func.isRequired,
  preferences: React.PropTypes.object,
  project: React.PropTypes.shape({
    configuration: React.PropTypes.object,
    description: React.PropTypes.string,
    display_name: React.PropTypes.string,
    experimental_tools: React.PropTypes.arrayOf(React.PropTypes.string),
    introduction: React.PropTypes.string,
  }).isRequired,
  splits: React.PropTypes.object,
};
