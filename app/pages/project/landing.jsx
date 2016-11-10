import React, {PropTypes} from 'react';
import FinishedBanner from './finished-banner';
import {Link} from 'react-router';

class ProjectPage extends React.Component {

  constructor() {
    super();
    this.state = {
      showWorkflows: false,
    };
  }

  renderWorkflows() {
    this.setState({ showWorkflows: !this.state.showWorkflows });
  }

  render() {
    let redirectCondition;
    let getStarted;
    const workflowChoose = !!this.props.project.configuration.user_chooses_workflow ? true : false;

    if (workflowChoose) {
      getStarted = (
        <a className="call-to-action standard-button" onClick={this.renderWorkflows.bind(this)}>
          Get Started
        </a>
      )
    } else {
      getStarted = (
        <Link to={`/projects/${this.props.project.slug}/classify`} className="call-to-action standard-button">
          Get Started
        </Link>
      )
    }

    if (this.props.project.redirect) {
      redirectCondition = (
        <a href={this.props.project.redirect} className="call-to-action standard-button">
          <strong>Visit the project</strong><br />
          <small>at {this.props.project.redirect}</small>
        </a>
      )
    } else {
      redirectCondition = (
        <div className="project-home-page__buttons">
          {getStarted}

          <Link to={`/projects/${this.props.project.slug}/about`} className="call-to-action standard-button">
            Learn More
          </Link>
        </div>
      )
    }

    return (
      <div className="project-home-page">
        <div className="call-to-action-container content-containe">
          <FinishedBanner project={this.props.project} />

          <div className="project-home-page__introduction">
            <span>{this.props.project.description}</span>

            {redirectCondition}
          </div>

        </div>

        {!!this.state.showWorkflows && (
          <div className="project-home-page__workflow-choice">

            <div className="project-home-page__content">
              <h4>{this.props.project.workflow_description}</h4>

              {this.props.activeWorkflows.map ((workflow) => {
                return (
                  <Link
                    to={"/projects/#{@props.project.slug}/classify"}
                    key={workflow.id + Math.random()}
                    className="call-to-action standard-button"
                  >
                    {workflow.display_name}
                  </Link>
                )
              })}

            </div>

          </div>
        )}

        <div className="project-home-page__talk-images">
        </div>

        <div className="project-home-page__stats-section">
        </div>

        <div className="project-home-page__about-section">
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
