import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

import ProjectIcon from '../../../components/project-icon';
import getWorkflowsInOrder from '../../../lib/get-workflows-in-order';
import WorkflowToggle from '../../../components/workflow-toggle';
import LoadingIndicator from '../../../components/loading-indicator';

import VersionList from './version-list-container';
import ExperimentalFeatures from './experimental-features-container';
import Toggle from './toggle-container';
import RedirectToggle from '../components/redirect-toggle';

class ProjectStatus extends Component {
  constructor(props) {
    super(props);
    this.onChangeWorkflowLevel = this.onChangeWorkflowLevel.bind(this);
    this.getWorkflows = this.getWorkflows.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
    this.renderError = this.renderError.bind(this);
    this.renderWorkflows = this.renderWorkflows.bind(this);

    this.state = {
      project: null,
      error: null,
      usedWorkflowLevels: [],
      workflows: []
    };
  }

  componentDidMount() {
    this.getProject().then(() => this.getWorkflows());
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
    const fields = 'display_name,active,configuration';
    return getWorkflowsInOrder(this.state.project, { fields }).then((workflows) => {
      const usedWorkflowLevels = this.getUsedWorkflowLevels(workflows);
      this.setState({ usedWorkflowLevels, workflows });
    });
  }

  getUsedWorkflowLevels(workflows) {
    return workflows
      .map(workflow => workflow.configuration.level)
      .filter(workflow => workflow);
  }

  renderError() {
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }
  }

  renderWorkflows() {
    if (this.state.workflows.length === 0) {
      return <div>No workflows found</div>;
    }

    return (
      <ul className="project-status__section-list">
        {this.state.workflows.map((workflow) => {
          return (
            <li key={workflow.id} className="section-list__item">
              <WorkflowToggle workflow={workflow} project={this.state.project} field="active" />{' | '}
              <label>
                Level:{' '}
                <select
                  onChange={this.onChangeWorkflowLevel.bind(null, workflow)}
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
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    if (!this.state.project) {
      return <LoadingIndicator />;
    }

    return (
      <div className="project-status">
        <ProjectIcon project={this.state.project} />
        <div className="project-status__section">
          <h4>Information</h4>
          <ul>
            <li>Id: {this.state.project.id}</li>
            <li>Classification count: {this.state.project.classifications_count}</li>
            <li>Subjects count: {this.state.project.subjects_count}</li>
            <li>Retired subjects count: {this.state.project.retired_subjects_count}</li>
            <li>Volunteer count: {this.state.project.classifiers_count}</li>
          </ul>
          <h4>Visibility Settings</h4>
          <ul className="project-status__section-list">
            <li>Private: <Toggle project={this.state.project} field="private" trueLabel="Private" falseLabel="Public" /></li>
            <li>Live: <Toggle project={this.state.project} field="live" trueLabel="Live" falseLabel="Development" /></li>
            <li>Beta Requested: <Toggle project={this.state.project} field="beta_requested" /></li>
            <li>Beta Approved: <Toggle project={this.state.project} field="beta_approved" /></li>
            <li>Launch Requested: <Toggle project={this.state.project} field="launch_requested" /></li>
            <li>Launch Approved: <Toggle project={this.state.project} field="launch_approved" /></li>
          </ul>
        </div>
        <RedirectToggle project={this.state.project} />
        <ExperimentalFeatures project={this.state.project} />
        <div className="project-status__section">
          <h4>Workflow Settings</h4>
          <small>The workflow level dropdown is for the workflow assignment experimental feature.</small>
          {this.renderError()}
          {this.renderWorkflows()}
        </div>
        <hr />
        <div className="project-status__section">
          <VersionList project={this.state.project} />
        </div>
      </div>
    );
  }
}

export default ProjectStatus;
