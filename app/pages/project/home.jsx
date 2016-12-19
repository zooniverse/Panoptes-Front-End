import React from 'react';
import FinishedBanner from './finished-banner';
import ProjectMetadata from './metadata';
import ProjectHomeWorkflowButtons from './home-workflow-buttons';
import { Markdown } from 'markdownz';


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

  render() {
    let workflowDescription;

    if (this.props.project.workflow_description && this.props.project.workflow_description !== '') {
      workflowDescription = this.props.project.workflow_description;
    }

    return (
      <div className="project-home-page">
        <div className="call-to-action-container content-container">
          <FinishedBanner project={this.props.project} />

          <div className="description">{this.props.project.description}</div>
          {workflowDescription &&
            <div className="workflow-description">
              {workflowDescription}
            </div>}

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

        <hr />
        <div className="introduction content-container">
          <h3 className="about-project">About {this.props.project.display_name}</h3>
          {this.props.project.introduction &&
            <Markdown project={this.props.project}>{this.props.project.introduction}</Markdown>}
        </div>

        <ProjectMetadata project={this.props.project} />
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
    workflow_description: React.PropTypes.string,
  }).isRequired,
  splits: React.PropTypes.object,
};

