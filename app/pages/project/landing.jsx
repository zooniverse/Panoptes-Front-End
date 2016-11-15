import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FinishedBanner from './finished-banner';
import TalkStatus from './talk-status';
import ProjectMetadata from './metadata';

class ProjectPage extends React.Component {

  constructor() {
    super();
    this.state = {
      researcherAvatar: null,
      researcherWords: '',
      showWorkflows: false,
    };
  }

  toggleWorkflows() {
    this.setState({ showWorkflows: !this.state.showWorkflows });
  }

  renderWorkflows() {
    return (
      <div className="project-home-page__workflow-choice">

        <div className="project-home-page__content">
          <div className="content-container">
            {!!this.props.project.workflow_description && (
              <h4>{this.props.project.workflow_description}</h4>
            )}

            {this.props.activeWorkflows.map((workflow) => {
              return (
                <Link
                  to={`/projects/${this.props.project.slug}/classify`}
                  key={workflow.id + Math.random()}
                  className="call-to-action standard-button"
                >
                  {workflow.display_name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  renderWorkflowAssignment() {
    const currentWorkflowAtLevel = this.props.activeWorkflows.filter((workflow) => {
      if (workflow.id === this.props.preferences.settings.workflow_id) {
        return workflow;
      }
    });
    const currentLevel = currentWorkflowAtLevel.length > 0 ? currentWorkflowAtLevel[0].configuration.level : 1;
    this.props.activeWorkflows.map((workflow) => {
      if (workflow.configuration.level <= currentLevel && workflow.configuration.level != null) {
        return (
          <Link
            to={`/projects/${this.props.project.slug}/classify`}
            key={workflow.id + Math.random()}
            className="call-to-action standard-button"
            onClick={this.handleWorkflowSelection.bind(this, workflow)}
          >
            You've unlocked level {workflow.display_name}
          </Link>
        );
      }
    });
  }

  handleWorkflowSelection(workflow) {
    this.props.onChangePreferences('preferences.selected_workflow', workflow.id)
    return undefined;
  }

  renderResearcherWords() {
    let avatarSrc = '/assets/simple-avatar.png';

    return (
      <div className="project-home-page__researcher-words">

        <img role="presentation" src={avatarSrc} />

        <div>
          <h4>Words from the researcher</h4>
          <span>"Here are some inspiring words about how much we need your help!"</span>
        </div>
      </div>
    );
  }

  render() {
    let redirectCondition;
    let getStarted;
    const workflowChoose = this.props.project.configuration.user_chooses_workflow ? true : false;

    if (workflowChoose) {
      getStarted = (
        <a className="call-to-action standard-button" onClick={this.toggleWorkflows.bind(this)}>
          Get Started
        </a>
      );
    } else {
      getStarted = (
        <Link to={`/projects/${this.props.project.slug}/classify`} className="call-to-action standard-button">
          Get Started
        </Link>
      );
    }

    if (this.props.project.redirect) {
      redirectCondition = (
        <a href={this.props.project.redirect} className="call-to-action standard-button">
          <strong>Visit the project</strong><br />
          <small>at {this.props.project.redirect}</small>
        </a>
      );
    } else if ((this.props.project.experimental_tools.indexOf('workflow assignment') !== -1) && (this.props.user != null)) {
      redirectCondition = this.renderWorkflowAssignment();
    } else {
      redirectCondition = (
        <div className="project-home-page__buttons">
          {getStarted}
          <Link to={`/projects/${this.props.project.slug}/about`} className="call-to-action standard-button">
            Learn More
          </Link>
        </div>
      );
    }

    return (
      <div className="project-home-page">
        <div className="call-to-action-container content-container">
          <FinishedBanner project={this.props.project} />

          <div className="project-home-page__introduction">
            <span>{this.props.project.description}</span>

            {redirectCondition}
          </div>

        </div>

        {!!this.state.showWorkflows && (
          this.renderWorkflows()
        )}

        <TalkStatus project={this.props.project} user={this.props.user} />

        <ProjectMetadata project={this.props.project} activeWorkflows={this.props.activeWorkflows} />

        <div className="project-home-page__research">
          {this.renderResearcherWords()}

          <div className="project-home-page__about-text">
            <h4>About {this.props.project.display_name}</h4>
            <span> {this.props.project.introduction} </span>
          </div>
        </div>

      </div>
    );
  }
}

ProjectPage.propTypes = {
  activeWorkflows: PropTypes.array.isRequired,
  owner: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

ProjectPage.defaultProps = {
  activeWorkflows: [],
  owner: {},
  project: {},
  user: null,
};

export default ProjectPage;
