import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import ProjectHomeWorkflowButton from './home-workflow-button';
import LoadingIndicator from '../../../components/loading-indicator';

export default class ProjectHomeWorkflowButtons extends React.Component {
  constructor() {
    super();

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
        {this.props.showWorkflowButtons && this.props.activeWorkflows.length > 0 &&
          (<div className="project-home-page__container project-home-workflow-buttons__workflow-choice-container">
            <div className="project-home-page__content">
              <h3 className="workflow-choice-container__call-to-action">
                <Translate content="project.home.getStarted" />{' '}
                <i className="fa fa-arrow-down" aria-hidden="true" />
              </h3>
              {this.props.translation.workflow_description && (
                <p className="workflow-choice-container__description">{this.props.translation.workflow_description}</p>
              )}
              {this.props.activeWorkflows.map((workflow) => {
                return (
                  <ProjectHomeWorkflowButton
                    key={workflow.id}
                    disabled={this.shouldWorkflowBeDisabled(workflow)}
                    preferences={this.props.preferences}
                    project={this.props.project}
                    user={this.props.user}
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
  preferences: {},
  project: {},
  showWorkflowButtons: false,
  splits: {},
  translation: {},
  user: null,
  workflowAssignment: false
};

ProjectHomeWorkflowButtons.propTypes = {
  activeWorkflows: PropTypes.arrayOf(PropTypes.object).isRequired,
  preferences: PropTypes.shape({
    preferences: PropTypes.object,
    settings: PropTypes.objectOf(PropTypes.string)
  }),
  project: PropTypes.shape({
    redirect: PropTypes.string,
    slug: PropTypes.string
  }).isRequired,
  showWorkflowButtons: PropTypes.bool.isRequired,
  splits: PropTypes.object,
  translation: PropTypes.shape({
    workflow_description: PropTypes.string
  }).isRequired,
  user: PropTypes.object,
  workflowAssignment: PropTypes.bool
};