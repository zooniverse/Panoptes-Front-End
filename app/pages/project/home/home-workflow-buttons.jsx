import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import ProjectHomeWorkflowButton from './home-workflow-button';
import LoadingIndicator from '../../../components/loading-indicator';

export default class ProjectHomeWorkflowButtons extends React.Component {
  constructor(props) {
    super(props);

    this.shouldWorkflowBeDisabled = this.shouldWorkflowBeDisabled.bind(this);
  }

  shouldWorkflowBeDisabled(workflow) {
    if (this.props.user && workflow.configuration.level && this.props.preferences && this.props.preferences.settings) {
      const currentWorkflowAtLevel = this.props.activeWorkflows.filter((activeWorkflow) => {
        return (activeWorkflow.id === this.props.preferences.settings.workflow_id) ? activeWorkflow : null;
      });
      const currentLevel = (currentWorkflowAtLevel.length > 0) ? currentWorkflowAtLevel[0].configuration.level : 1;

      return (workflow.configuration.level > currentLevel);
    }

    return false;
  }

  render() {
    if (this.props.project && this.props.project.redirect) {
      return null;
    }

    return (
      <div className="project-home-workflow-buttons">
        {this.props.showWorkflowButtons && this.props.activeWorkflows.length > 0 && this.props.preferences &&
          (<div className="project-home-page__container project-home-workflow-buttons__workflow-choice-container">
            <div className="project-home-page__content">
              <h3 className="workflow-choice-container__call-to-action">
                <Translate content="project.home.getStarted" />{' '}
                <i className="fa fa-arrow-down" aria-hidden="true" />
              </h3>
              {this.props.project.workflow_description && (
                <p className="workflow-choice-container__description">{this.props.project.workflow_description}</p>
              )}
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
            }</div>
          </div>)}

        {this.props.showWorkflowButtons && this.props.activeWorkflows.length === 0 &&
          <div className="project-home-page__container workflow-choice"><LoadingIndicator /></div>}
      </div>
    );
  }
}

ProjectHomeWorkflowButtons.defaultProps = {
  activeWorkflows: [],
  onChangePreferences: () => {},
  preferences: {},
  project: {},
  showWorkflowButtons: false,
  splits: {},
  user: null,
  workflowAssignment: false
};

ProjectHomeWorkflowButtons.propTypes = {
  activeWorkflows: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChangePreferences: React.PropTypes.func.isRequired,
  preferences: React.PropTypes.shape({
    preferences: React.PropTypes.object,
    settings: React.PropTypes.objectOf(React.PropTypes.string)
  }),
  project: React.PropTypes.shape({
    redirect: React.PropTypes.string,
    slug: React.PropTypes.string,
    workflow_description: React.PropTypes.string
  }).isRequired,
  showWorkflowButtons: React.PropTypes.bool.isRequired,
  splits: React.PropTypes.object,
  user: React.PropTypes.object,
  workflowAssignment: React.PropTypes.bool
};
