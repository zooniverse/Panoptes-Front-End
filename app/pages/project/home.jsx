import React from 'react';
import FinishedBanner from './finished-banner';
import ProjectMetadata from './metadata';
import ProjectHomeWorkflowButtons from './home-workflow-buttons';
import markdownz from 'markdownz';
const Markdown = markdownz.Markdown;


export default class ProjectHomePage extends React.Component {
  render() {
    let workflowDescription;
    let showWorkflowButtons = false;
    const workflowAssignment = this.props.project.experimental_tools.includes('workflow assignment');

    if (this.props.project.workflow_description && this.props.project.workflow_description !== '') {
      workflowDescription = this.props.project.workflow_description;
    }

    if ((this.props.project.configuration && this.props.project.configuration.user_chooses_workflow) || workflowAssignment) {
      showWorkflowButtons = true;
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
            showWorkflowButtons={showWorkflowButtons}
            workflowAssignment={workflowAssignment}
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

ProjectHomePage.defaultProps = {
  activeWorkflows: [],
  onChangePreferences: () => {},
  preferences: {},
  project: {},
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
};

