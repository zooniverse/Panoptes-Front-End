import React from 'react';
import { Link } from 'react-router';
import ProjectHomeWorkflowButton from './home-workflow-button';
import locationMatch from '../../lib/location-match';


export default class ProjectHomeWorkflowButtons extends React.Component {
  constructor(props) {
    super(props);

    this.handleSplitWorkflowAssignment = this.handleSplitWorkflowAssignment.bind(this);
    this.shouldWorkflowBeDisabled = this.shouldWorkflowBeDisabled.bind(this);
    this.renderRedirectLink = this.renderRedirectLink.bind(this);
    this.renderWorkflowButtons = this.renderWorkflowButtons.bind(this);
  }

  shouldWorkflowBeDisabled(workflow) {
    if (this.context.user && workflow.configuration.level && this.props.preferences) {
      const currentWorkflowAtLevel = this.props.activeWorkflows.filter((activeWorkflow) => {
        return (activeWorkflow.id === this.props.preferences.settings.workflow_id) ? activeWorkflow : null;
      });
      const currentLevel = (currentWorkflowAtLevel.length > 0) ? currentWorkflowAtLevel[0].configuration.level : 1;

      return (workflow.configuration.level > currentLevel);
    }

    return false;
  }

  handleSplitWorkflowAssignment() {
    let workflowAssignmentID = '2334';

    if (process.env.NODE_ENV === 'production' || locationMatch(/\W?env=(production)/)) {
      workflowAssignmentID = '2360';
    }

    if (this.props.splits['workflow.assignment']) {
      this.props.onChangePreferences('preferences.selected_workflow', workflowAssignmentID);
    }
  }

  renderRedirectLink() {
    return (<a href={this.props.project.redirect} className="call-to-action standard-button">
      <strong>Visit the project</strong><br />
      <small>at {this.props.project.redirect}</small>
    </a>);
  }

  renderWorkflowButtons() {
    if (this.props.activeWorkflows.length > 0) {
      return (
        <div className="call-to-action-container__buttons">
          {this.props.activeWorkflows.map((workflow) => {
            return (
              <ProjectHomeWorkflowButton
                key={workflow.id}
                disabled={this.shouldWorkflowBeDisabled(workflow)}
                onChangePreferences={this.props.onChangePreferences}
                project={this.props.project}
                workflow={workflow}
                workflowAssignment={this.props.workflowAssignment}
              />);
          })
        }</div>);
    }

    return (<span>Loading...</span>);
  }

  render() {
    if (this.props.project.redirect) {
      return this.renderRedirectLink();
    }

    if (this.props.showWorkflowButtons) {
      if (this.props.splits && this.props.preferences && this.props.workflowAssignment) {
        const gravitySpySplit = (this.props.splits['workflow.assignment']) ? this.props.splits['workflow.assignment'].variant.value.description === 'Apprentice workflow assignment' : false;
        const newToProject = Object.keys(this.props.preferences.preferences).length === 0;

        if (newToProject && gravitySpySplit) {
          return (
            <Link
              to={`/projects/${this.props.project.slug}/classify`}
              className="call-to-action standard-button"
              onClick={this.handleSplitWorkflowAssignment}
            >
              Get started!
            </Link>
          );
        }
      }

      return this.renderWorkflowButtons();
    }

    return (
      <Link to={`/projects/${this.props.project.slug}/classify`} className="call-to-action standard-button">
        Get started!
      </Link>
    );
  }
}

ProjectHomeWorkflowButtons.contextTypes = {
  geordi: React.PropTypes.object,
  user: React.PropTypes.object,
};

ProjectHomeWorkflowButtons.defaultProps = {
  activeWorkflows: [],
  onChangePreferences: () => {},
  preferences: {},
  project: {},
  showWorkflowButtons: false,
  splits: {},
  workflowAssignment: false,
};

ProjectHomeWorkflowButtons.propTypes = {
  activeWorkflows: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChangePreferences: React.PropTypes.func.isRequired,
  preferences: React.PropTypes.shape({
    preferences: React.PropTypes.object,
    settings: React.PropTypes.objectOf(React.PropTypes.string),
  }),
  project: React.PropTypes.shape({
    redirect: React.PropTypes.string,
    slug: React.PropTypes.string,
  }).isRequired,
  showWorkflowButtons: React.PropTypes.bool.isRequired,
  splits: React.PropTypes.object,
  workflowAssignment: React.PropTypes.bool,
};
