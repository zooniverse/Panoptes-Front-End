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
    this.onBlurTrainingDefaultChance = this.onBlurTrainingDefaultChance.bind(this);
    this.onBlurTrainingSetIds = this.onBlurTrainingSetIds.bind(this);
    this.onBlurTrainingChances = this.onBlurTrainingChances.bind(this);
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
      project: null,
      usedWorkflowLevels: [],
      workflows: [],

      // transitional input values for text input fields, in the format of { workflow_id_1: 'string', ... }
      valTrainingSetIds: {},
      valTrainingChances: {},
      valTrainingDefaultChance: {}
    };
  }

  componentDidMount() {
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

  onBlurTrainingSetIds(workflow, event) {
    this.setState({ error: null });
    let val = this.state.valTrainingSetIds[workflow.id] || '';
    val = val.split(',').map((str) => { return parseInt(str) })
      .filter((num) => { return !isNaN(num) });
    // TODO: if the value is an empty string, the field should be deleted altogether.
    return workflow.update({ 'configuration.training_set_ids': val }).save()
      .then(() => this.getWorkflows())
      .catch(error => this.setState({ error }));
  }

  onBlurTrainingChances(workflow, event) {
    this.setState({ error: null });
    let val = this.state.valTrainingChances[workflow.id] || '';
    val = val.split(',').map((str) => { return parseFloat(str) })
      .filter((num) => { return !isNaN(num) });
    // TODO: if the value is an empty string, the field should be deleted altogether.
    return workflow.update({ 'configuration.training_chances': val }).save()
      .then(() => this.getWorkflows())
      .catch(error => this.setState({ error }));
  }

  onBlurTrainingDefaultChance (workflow, event) {
    this.setState({ error: null });
    const val =
      this.state.valTrainingDefaultChance[workflow.id]
      ? parseFloat(this.state.valTrainingDefaultChance[workflow.id]) : '';
    if (val && isNaN(val)) return;  // Ignore invalid values (note: empty string is considered valid here)
    // TODO: if the value is an empty string, the field should be deleted altogether.
    return workflow.update({ 'configuration.training_default_chance': val }).save()
      .then(() => this.getWorkflows())
      .catch(error => this.setState({ error }));
  }

  onChangeSubjectViewer(workflow, event) {
    this.setState({ error: null })
    let selected = event.target.value
    selected = selected === 'none' ? undefined : selected;
    if (!workflow.configuration.classifier_version) {
      workflow.update({ 'configuration.classifier_version': '2.0' });
    }
    return workflow.update({ 'configuration.subject_viewer': selected }).save()
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
    const fields = 'display_name,active,configuration,grouped,prioritized,retirement';
    return getWorkflowsInOrder(this.state.project, { fields }).then((workflows) => {

      // Setup transitional input values
      const valTrainingSetIds = {}, valTrainingChances = {}, valTrainingDefaultChance = {}
      workflows.forEach((wf) => {
        valTrainingSetIds[wf.id] =
          (wf.configuration.training_set_ids && wf.configuration.training_set_ids.join)
          ? wf.configuration.training_set_ids.join(',')
          : '';
        valTrainingChances[wf.id] =
          (wf.configuration.training_chances && wf.configuration.training_chances.join)
          ? wf.configuration.training_chances.join(',')
          : '';
        // Note: please allow default chance to be 0. This is a valid edge case.
        valTrainingDefaultChance[wf.id] =
          (wf.configuration.training_default_chance >= 0 && wf.configuration.training_default_chance !== null)
          ? wf.configuration.training_default_chance
          : '';
      })

      const usedWorkflowLevels = this.getUsedWorkflowLevels(workflows);
      this.setState({
        usedWorkflowLevels,
        valTrainingSetIds,
        valTrainingChances,
        valTrainingDefaultChance,
        workflows
      });
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
    const { project } = this.state;
    return project.update({ featured: target.checked }).save()
      .catch(error => this.setState({ error }));
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

  toggleWorkflowGrouped(event, workflow) {
    workflow
      .update({ grouped: event.target.checked })
      .save()
      .catch(error => this.setState({ error }));
  }

  toggleWorkflowPrioritized(event, workflow) {
    workflow
      .update({ prioritized: event.target.checked })
      .save()
      .catch(error => this.setState({ error }));
  }

  renderWorkflows() {
    if (this.state.workflows.length === 0) {
      return <div>No workflows found</div>;
    }

    return (
      <div>
        {this.state.dialogIsOpen &&
          <WorkflowDefaultDialog
            onCancel={this.handleDialogCancel}
            onSuccess={this.handleDialogSuccess}
          />}
        {this.state.workflows.map((workflow) => {
          return (
            <fieldset key={workflow.id} className="project-status__section-settings">
              <legend>{`Workflow ${workflow.id}: ${workflow.display_name}`}</legend>
              <div>
                <h4>Workflow Activeness</h4>
                {this.state.project.configuration &&
                  this.state.project.configuration.default_workflow === workflow.id ? ' * ' : ''}
                <WorkflowToggle
                  workflow={workflow}
                  name="active"
                  checked={workflow.active}
                  handleToggle={event => this.handleToggle(event, workflow)}
                />
              </div>
              <hr />
              <div>
                <h4>Workflow assignment/promotion settings</h4>
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
              </div>
              <hr />
              <div>
                <h4>Subject retirement settings</h4>
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
              </div>
              <hr />
              <div>
                <h4>Configure Training Data</h4>
                <label>
                  Training Set IDs:{' '}
                  <input
                    id="training-set-ids"
                    type="text"
                    onBlur={(event) => this.onBlurTrainingSetIds(workflow, event)}
                    onChange={(event) => {
                      const updatedTrainingSetIds = Object.assign({}, this.state.valTrainingSetIds)
                      updatedTrainingSetIds[workflow.id] = event.target.value
                      this.setState({ valTrainingSetIds: updatedTrainingSetIds })
                    }}
                    value={this.state.valTrainingSetIds[workflow.id]}
                  />
                </label>
                <label>
                  Training Chances:{' '}
                  <input
                    id="training-chances"
                    type="text"
                    onBlur={(event) => this.onBlurTrainingChances(workflow, event)}
                    onChange={(event) => {
                      const updatedTrainingChances = Object.assign({}, this.state.valTrainingChances)
                      updatedTrainingChances[workflow.id] = event.target.value
                      this.setState({ valTrainingChances: updatedTrainingChances })
                    }}
                    value={this.state.valTrainingChances[workflow.id]}
                  />
                </label>
                <label>
                  Training Default Chance:{' '}
                  <input
                    id="training-default-chance"
                    type="text"
                    onBlur={(event) => this.onBlurTrainingDefaultChance(workflow, event)}
                    onChange={(event) => {
                      const updatedTrainingDefaultChance = Object.assign({}, this.state.valTrainingDefaultChance)
                      updatedTrainingDefaultChance[workflow.id] = event.target.value
                      this.setState({ valTrainingDefaultChance: updatedTrainingDefaultChance })
                    }}
                    value={(this.state.valTrainingDefaultChance[workflow.id] || '')}
                  />
                </label>
              </div>
              <hr />
              <div>
                <h4>Subject viewer layout settings</h4>
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
              </div>
              <hr />
              <div>
                <h4>Subject selection settings</h4>
                <label>
                  <input
                    id="grouped"
                    type="checkbox"
                    onChange={event => this.toggleWorkflowGrouped(event, workflow)}
                    defaultChecked={workflow.grouped}
                  />
                  Use grouped subject selection
                </label>
                <label>
                  <input
                    id="prioritized"
                    type="checkbox"
                    onChange={event => this.toggleWorkflowPrioritized(event, workflow)}
                    defaultChecked={workflow.prioritized}
                  />
                  Use prioritized (sequential) subject selection
                </label>
              </div>
              <hr />
              <div>
                <h4>Classifier 2.0 (rewrite) settings</h4>
                <p>Note that that Scatter Plot is preferred over TESS Light Curve for that kind of JSON subject data. The TESS light curve viewer is built specifically for their requirements. The code in the viewer assumes the project is using a task like them.</p>

                <label>
                  Subject Viewer:{' '}
                  <select
                    id="subject-viewers"
                    onChange={(event) => this.onChangeSubjectViewer(workflow, event)}
                    value={workflow.configuration.subject_viewer}
                  >
                    <option value="none">None Selected</option>
                    <option value="dataImage">Data Image</option>
                    <option value="lightcurve">(D3/TESS) Light Curve</option>
                    <option value="multiFrame">Multi-Frame</option>
                    <option value="scatterPlot">Scatter Plot</option>
                    <option value="singleImage">Single Image</option>
                    <option value="subjectGroup">Subject Group</option>
                    <option value="variableStar">Variable Star</option>
                  </select>
                </label>
              </div>
            </fieldset>
          );
        })}
      </div>
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
          <h4>Opt-In API Features</h4>
          <ul className="project-status__section-list">
            <li>Run SubjectSet Completion Events: <Toggle project={project} field="run_subject_set_completion_events" /></li>
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
          <h3>Workflow Settings</h3>
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
