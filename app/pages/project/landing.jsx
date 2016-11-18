import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import markdownz from 'markdownz';
import FinishedBanner from './finished-banner';
import TalkStatus from './talk-status';
import ProjectMetadata from './metadata';

const Markdown = markdownz.Markdown;

class ProjectHomePage extends React.Component {

  constructor() {
    super();
    this.state = {
      researcherWords: '',
      showWorkflows: false,
    };
  }

  toggleWorkflows() {
    this.setState({ showWorkflows: !this.state.showWorkflows });
  }

  handleWorkflowSelection(workflow) {
    this.props.onChangePreferences('preferences.selected_workflow', workflow.id);
    return undefined;
  }

  renderWorkflows() {
    const workflowDescription = this.props.project.workflow_description ? this.props.project.workflow_description : 'Choose a workflow and get started';

    return (
      <div className="project-home-page__section">

        <div className="project-home-page__content top-arrow">
          <h4>{workflowDescription}</h4>

          {this.props.activeWorkflows.map((workflow) => {
            return (
              <Link
                to={`/projects/${this.props.project.slug}/classify`}
                key={workflow.id + Math.random()}
                className="standard-button"
              >
                {workflow.display_name}
              </Link>
            );
          })}
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
            className="standard-button"
            onClick={this.handleWorkflowSelection.bind(this, workflow)}
          >
            You&apos;ve unlocked level {workflow.display_name}
          </Link>
        );
      }
    });
  }

  renderResearcherWords() {
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
    let redirectCondition;
    let getStarted;
    const workflowChoose = this.props.project.configuration.user_chooses_workflow;

    if (workflowChoose) {
      getStarted = (
        <a className="standard-button" onClick={this.toggleWorkflows.bind(this)}>
          Get Started
        </a>
      );
    } else {
      getStarted = (
        <Link to={`/projects/${this.props.project.slug}/classify`} className="standard-button">
          Get Started
        </Link>
      );
    }

    if (this.props.project.redirect) {
      redirectCondition = (
        <a href={this.props.project.redirect} className="standard-button">
          <strong>Visit the project</strong><br />
          <small>at {this.props.project.redirect}</small>
        </a>
      );
    } else if ((this.props.project.experimental_tools.indexOf('workflow assignment') !== -1) && (this.props.user != null)) {
      redirectCondition = this.renderWorkflowAssignment();
    } else {
      redirectCondition = (
        <div>
          {getStarted}
          <Link to={`/projects/${this.props.project.slug}/about`} className="standard-button">
            Learn More
          </Link>
        </div>
      );
    }

    return (
      <div className="project-home-page">

        <div className="project-home-page__introduction">

          <FinishedBanner project={this.props.project} />
          <span>{this.props.project.description}</span>
          {redirectCondition}

        </div>

        {!!this.state.showWorkflows && (
          this.renderWorkflows()
        )}

        <TalkStatus project={this.props.project} user={this.props.user} />

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

ProjectHomePage.propTypes = {
  activeWorkflows: React.PropTypes.array.isRequired,
  onChangePreferences: React.PropTypes.func,
  owner: React.PropTypes.object.isRequired,
  preferences: React.PropTypes.object.isRequired,
  project: React.PropTypes.object.isRequired,
  user: React.PropTypes.object,
};

ProjectHomePage.defaultProps = {
  activeWorkflows: [],
  owner: {},
  preferences: {},
  project: {},
  user: {},
};

export default ProjectHomePage;
