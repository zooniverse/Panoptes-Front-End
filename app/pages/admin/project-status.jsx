import PropTypes from 'prop-types';
import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

import ProjectIcon from '../../components/project-icon';
import getWorkflowsInOrder from '../../lib/get-workflows-in-order';
import WorkflowToggle from '../../components/workflow-toggle';
import LoadingIndicator from '../../components/loading-indicator';

import VersionList from './project-status/version-list';
import ExperimentalFeatures from './project-status/experimental-features';
import Toggle from './project-status/toggle';
import FeaturedProjectToggle from './featured-project-toggle';
import RedirectToggle from './project-status/redirect-toggle';
import WorkflowDefaultDialog from './workflow-default-dialog';

class ProjectStatus extends Component {
  constructor(props) {
    super(props);
    this.onChangeWorkflowLevel = this.onChangeWorkflowLevel.bind(this);
    this.onChangeWorkflowRetirement = this.onChangeWorkflowRetirement.bind(this);
    this.getWorkflows = this.getWorkflows.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
    this.renderWorkflows = this.renderWorkflows.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.getProjectAndWorkflows = this.getProjectAndWorkflows.bind(this);
    this.handleDialogCancel = this.handleDialogCancel.bind(this);
    this.handleDialogSuccess = this.handleDialogSuccess.bind(this);
    this.handleProjectStateChange = this.handleProjectStateChange.bind(this);
    this.handleFeaturedProjectChange = this.handleFeaturedProjectChange.bind(this);
    this.state = {
      dialogIsOpen: false,
      error: null,
      featuredProject: null,
      project: null,
      usedWorkflowLevels: [],
      workflows: []
    };
  }

  componentDidMount() {
    this.getFeaturedProject();
    this.getProjectAndWorkflows();
  }

  componentWillUnmount() {
    this.state.project.stopListening('change', this.forceUpdate);
  }

  onChangeWorkflowLevel(workflow, event) {
    this.setState({ error: null });
    let selected = event.target.value;
    selected = selected === 'none' ? undefined : selected;
    return workflow.update({ 'configuration.level': selected }).save()
      .then(() => this.getWorkflows())
      .catch(error => this.setState({ error }));
  }

  onChangeWorkflowRetirement(workflow, event) {
    this.setState({ error: null });
    let selected = event.target.value;
    return workflow.update({ 'retirement.criteria': selected }).save()
      .then(() => this.getWorkflows())
      .catch(error => this.setState({ error }));
  }

  getFeaturedProject() {
    return apiClient.type('projects')
      .get({ featured: true, cards: true })
      .then(([featuredProject]) => {
        this.setState({ featuredProject });
      });
  }

  getProject() {
    const { owner, name } = this.props.params;
    const slug = `${owner}/${name}`;

    return apiClient.type('projects').get({ slug }).then((projects) => {
      const project = projects[0];
      // TODO: We ought to improve this ChangeListener replacement
      project.listen('change', this.forceUpdate);
      this.setState({ project });
      return project;
    });
  }

  getWorkflows() {
    const fields = 'display_name,active,configuration,retirement';
    return getWorkflowsInOrder(this.state.project, { fields }).then((workflows) => {
      const usedWorkflowLevels = this.getUsedWorkflowLevels(workflows);
      this.setState({ usedWorkflowLevels, workflows });
    });
  }

  getProjectAndWorkflows() {
    this.getProject().then(() => this.getWorkflows());
  }

  getUsedWorkflowLevels(workflows) {
    return workflows
      .map(workflow => workflow.configuration.level)
      .filter(workflow => workflow);
  }

  handleDialogCancel() {
    this.setState({ dialogIsOpen: false });
  }

  handleDialogSuccess() {
    const defaultWorkflow = this.state.workflows.filter(workflow =>
      workflow.id === this.state.project.configuration.default_workflow
    );
    this.state.project.update({ 'configuration.default_workflow': undefined }).save()
      .then(() => {
        defaultWorkflow[0].update({ active: false }).save()
          .then(() => {
            this.getProjectAndWorkflows();
          })
          .catch(error => this.setState({ error }));
      })
      .then(() => {
        this.setState({
          dialogIsOpen: false
        });
      })
      .catch(error => this.setState({ error }));
  }

  handleProjectStateChange({ target }) {
    this.state.project.update({ state: target.value });
    this.state.project.save()
      .catch(error => this.setState({ error }));
  }

  handleFeaturedProjectChange({ target }) {
    const { featuredProject, project } = this.state;
    project.update({ featured: target.checked });
    if (featuredProject) {
      return featuredProject.update({ featured: false }).save()
        .then(() => project.save())
        .then(newFeaturedProject => this.setState({
          featuredProject: newFeaturedProject
        }))
        .catch(error => this.setState({ error }));
    } else {
      return project.save()
        .catch(error => this.setState({ error }));
    }
  }

  handleToggle(event, workflow) {
    this.setState({ error: null });
    const isChecked = event.target.checked;
    let defaultWorkflowId;

    if (this.state.project.configuration) {
      defaultWorkflowId = this.state.project.configuration.default_workflow;
    }

    if (defaultWorkflowId === workflow.id && workflow.active) {
      this.setState({
        dialogIsOpen: true
      });
    }

    if ((defaultWorkflowId !== workflow.id) || (defaultWorkflowId === workflow.id && !workflow.active)) {
      workflow.update({ active: isChecked }).save()
        .catch(error => this.setState({ error }));
    }
  }

  toggleWorkflowImageHeight(workflow, e) {
    const noMaxHeight = e.target.checked;
    const { image_layout } = workflow.configuration;
    const newLayout = image_layout && image_layout.slice ? image_layout.slice() : []
    const index = newLayout.indexOf('no-max-height');
    newLayout.splice(index, 1);
    if (noMaxHeight) {
      newLayout.push('no-max-height');
    }
    workflow.update({ 'configuration.image_layout': newLayout }).save();
  }
  renderWorkflows() {
    if (this.state.workflows.length === 0) {
      return <div>No workflows found</div>;
    }

    return (
      <ul className="project-status__section-list">
        {this.state.dialogIsOpen &&
          <WorkflowDefaultDialog
            onCancel={this.handleDialogCancel}
            onSuccess={this.handleDialogSuccess}
          />}
        {this.state.workflows.map((workflow) => {
          return (
            <li key={workflow.id} className="section-list__item">
              {this.state.project.configuration &&
                this.state.project.configuration.default_workflow === workflow.id ? ' * ' : ''}
              <WorkflowToggle
                workflow={workflow}
                name="active"
                checked={workflow.active}
                handleToggle={event => this.handleToggle(event, workflow)}
              />{' | '}
              <label>
                Level:{' '}
                <select
                  id='promotionLevels'
                  onChange={(event) => this.onChangeWorkflowLevel(workflow, event)}
                  value={workflow.configuration.level && workflow.configuration.level}
                >
                  <option value="none">none</option>
                  {this.state.workflows.map((w, i) => {
                    const value = i + 1;
                    return (
                      <option
                        key={i + Math.random()}
                        value={value}
                        disabled={this.state.usedWorkflowLevels.indexOf(value) > -1}
                      >
                        {value}
                      </option>
                    );
                  })}
                </select>
              </label>
              {' | '}
              <label>
                Retirement:{' '}
                <select
                  id='retirementConfig'
                  onChange={(event) => this.onChangeWorkflowRetirement(workflow, event)}
                  value={workflow.retirement.criteria}
                >
                  <option value="never_retire">Never Retire</option>
                  <option value="classification_count">Classification Count - {(workflow.retirement.options && workflow.retirement.options.count) || ''}</option>
                </select>
              </label>
              <fieldset>
                <legend>Subject image layout</legend>
                <label>
                  <input
                    type="checkbox"
                    name="configuration.image_layout"
                    value="no-max-height"
                    defaultChecked={
                      workflow.configuration.image_layout &&
                      workflow.configuration.image_layout.indexOf('no-max-height') > -1
                    }
                    onChange={event => this.toggleWorkflowImageHeight(workflow, event)}
                  />
                  no max height
                </label>
              </fieldset>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const { error, project } = this.state;
    if (!project) {
      return <LoadingIndicator />;
    }

    const projectState = project.state || 'live';

    return (
      <div className="project-status">
        <ProjectIcon project={project} />

        <div className="project-status__section project-status__section--state">
          <h4>Project State</h4>
          <fieldset>
            <label htmlFor="project-state-active">
              <input
                id="project-state-active"
                name="project-state-buttons"
                type="radio"
                value=""
                checked={projectState === 'live'}
                onChange={this.handleProjectStateChange}
              />
              Active
            </label>
            <label htmlFor="project-state-paused">
              <input
                id="project-state-paused"
                name="project-state-buttons"
                type="radio"
                value="paused"
                checked={projectState === 'paused'}
                onChange={this.handleProjectStateChange}
              />
              Paused
            </label>
            <label htmlFor="project-state-finished">
              <input
                id="project-state-finished"
                name="project-state-buttons"
                type="radio"
                value="finished"
                checked={projectState === 'finished'}
                onChange={this.handleProjectStateChange}
              />
              Finished
            </label>
          </fieldset>
        </div>

        <div className="project-status__section">
          <h4>Information</h4>
          <ul>
            <li>Id: <a href={`/lab/${project.id}`}>{project.id}</a></li>
            <li>Classification count: {project.classifications_count}</li>
            <li>Subjects count: {project.subjects_count}</li>
            <li>Retired subjects count: {project.retired_subjects_count}</li>
            <li>Volunteer count: {project.classifiers_count}</li>
          </ul>
          <h4>Visibility Settings</h4>
          <ul className="project-status__section-list">
            <li>Private: <Toggle project={project} field="private" trueLabel="Private" falseLabel="Public" /></li>
            <li>Live: <Toggle project={project} field="live" trueLabel="Live" falseLabel="Development" /></li>
            <li>Beta Requested: <Toggle project={project} field="beta_requested" /></li>
            <li>Beta Approved: <Toggle project={project} field="beta_approved" /></li>
            <li>Launch Requested: <Toggle project={project} field="launch_requested" /></li>
            <li>Launch Approved: <Toggle project={project} field="launch_approved" /></li>
          </ul>
        </div>
        <RedirectToggle project={project} />
        <FeaturedProjectToggle
          error={error}
          project={project}
          handleProjectChange={this.handleFeaturedProjectChange}
        />
        <ExperimentalFeatures project={project} />
        <div className="project-status__section">
          <h4>Workflow Settings</h4>
          <small>The workflow level dropdown is for the workflow assignment experimental feature.</small>
          <br />
          <small>An asterisk (*) denotes a default workflow.</small>
          {this.state.error &&
            `Error ${this.state.error.status}: ${this.state.error.message}`}
          {this.renderWorkflows()}
        </div>
        <hr />
        <div className="project-status__section">
          <VersionList project={project} />
        </div>
      </div>
    );
  }
}

ProjectStatus.propTypes = {
  params: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string
  })
};

ProjectStatus.defaultProps = {
  params: {}
};

export default ProjectStatus;
