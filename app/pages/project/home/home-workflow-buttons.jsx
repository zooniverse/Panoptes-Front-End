import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import ProjectHomeWorkflowButton from './home-workflow-button';
import LoadingIndicator from '../../../components/loading-indicator';

counterpart.registerTranslations('en', {
  buttons: {

  }
});

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
    const paddingBottom = this.props.showWorkflowButtons ? { paddingBottom: '3em' } : {};

    if (this.props.project && this.props.project.redirect) {
      return (
        <a href={this.props.project.redirect} className="standard-button">
          <strong>Visit the project</strong><br />
          <small>at {this.props.project.redirect}</small>
        </a>
      );
    }

    return (
      <div>
        <div className="project-home-page__centering" style={paddingBottom}>
          <Link to={`/projects/${this.props.project.slug}/about`} className="standard-button learn-more">
            <Translate content="project.home.learnMore" />
          </Link>
          {!this.props.showWorkflowButtons &&
            <Link
              to={`/projects/${this.props.project.slug}/classify`}
              className="standard-button get-started"
            >
              <Translate content="project.home.getStarted" />
            </Link>}
        </div>

        {this.props.showWorkflowButtons && this.props.activeWorkflows.length > 0 && this.props.preferences &&
          (<div className="project-home-page__container workflow-choice">
            <div className="project-home-page__content">
              <h3>
                <Translate content="project.home.getStarted" />
                <i className="fa fa-arrow-down" aria-hidden="true" />
              </h3>
              {this.props.project.workflow_description && (
                <h4>{this.props.project.workflow_description}</h4>
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
