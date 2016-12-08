React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require 'panoptes-client/lib/api-client'
SetToggle = require '../../lib/set-toggle'
moment = require 'moment'
ChangeListener = require '../../components/change-listener'
ProjectIcon = require '../../components/project-icon'
AutoSave = require '../../components/auto-save'
getWorkflowsInOrder = require '../../lib/get-workflows-in-order'
WorkflowToggle = require '../../components/workflow-toggle'

`import VersionList from './project-status/version-list';`
`import ExperimentalFeatures from './project-status/experimental-features';`
`import Toggle from './project-status/toggle';`
`import RedirectToggle from './project-status/redirect-toggle';`

ProjectStatus = React.createClass
  displayName: "ProjectStatus"

  propTypes:
    project: React.PropTypes.object.isRequired

  getInitialState: ->
    error: null
    usedWorkflowLevels: []
    workflows: []

  getDefaultProps: ->
    project: null

  componentDidMount: ->
    @getWorkflows()

  onChangeWorkflowLevel: (workflow, event) ->
    selected = event.target.value
    workflowToUpdate = workflow

    if @state.error
      @setState error: null

    # Saving explicitly to avoid potential race condition with projects with many workflows
    if selected is 'none'
      workflowToUpdate.update({ 'configuration.level': undefined })
    else
      workflowToUpdate.update({ 'configuration.level': selected })

    workflowToUpdate.save()
      .then =>
        @getWorkflows()
      .catch (error) =>
        @setState error: error

  getWorkflows: ->
    getWorkflowsInOrder @props.project, fields: 'display_name,active,configuration'
      .then (workflows) =>
        usedWorkflowLevels = @getUsedWorkflowLevels(workflows)
        @setState { usedWorkflowLevels, workflows }

  getUsedWorkflowLevels: (workflows) ->
    usedWorkflowLevels = []

    for workflow in workflows
      if workflow.configuration.level?
        usedWorkflowLevels.push(workflow.configuration.level);

    usedWorkflowLevels

  render: ->
    <ChangeListener target={@props.project}>{ =>
      <div className="project-status">
        <ProjectIcon project={@props.project} />
        <div className="project-status__section">
          <h4>Visibility Settings</h4>
          <ul className="project-status__section-list">
            <li>Private: <Toggle project={@props.project} field="private" trueLabel="Private" falseLabel="Public" /></li>
            <li>Live: <Toggle project={@props.project} field="live" trueLabel="Live" falseLabel="Development" /></li>
            <li>Beta Requested: <Toggle project={@props.project} field="beta_requested" /></li>
            <li>Beta Approved: <Toggle project={@props.project} field="beta_approved" /></li>
            <li>Launch Requested: <Toggle project={@props.project} field="launch_requested" /></li>
            <li>Launch Approved: <Toggle project={@props.project} field="launch_approved" /></li>
          </ul>
        </div>
        <RedirectToggle project={@props.project} />
        <ExperimentalFeatures project={@props.project} />
        <div className="project-status__section">
          <h4>Workflow Settings</h4>
          <small>The workflow level dropdown is for the workflow assignment experimental feature.</small>
          {if @state.error
            <div>{@state.error}</div>}
          {if @state.workflows.length is 0
            <div>No workflows found</div>
          else
            <ul className="project-status__section-list">
              {@state.workflows.map (workflow) =>
                <li key={workflow.id} className="section-list__item">
                  <WorkflowToggle workflow={workflow} project={@props.project} field="active" />{' | '}
                  <label>
                    Level:{' '}
                    <select
                      onChange={@onChangeWorkflowLevel.bind(null, workflow)}
                      value={if workflow.configuration.level? then workflow.configuration.level}
                    >
                      <option value="none">none</option>
                      {@state.workflows.map (workflow, i) =>
                        value = i + 1
                        <option
                          key={i + Math.random()}
                          value={value}
                          disabled={@state.usedWorkflowLevels.indexOf(value) > -1}
                        >
                          {value}
                        </option>}
                    </select>
                  </label>
                </li>}
            </ul>}
        </div>
        <hr />
        <div className="project-status__section">
          <VersionList project={@props.project} />
        </div>
      </div>
    }</ChangeListener>

module.exports = React.createClass
  displayName: "ProjectStatusPage"

  getProject: ->
    {owner, name} = @props.params
    slug = owner + "/" + name

    apiClient.type('projects').get(slug: slug)

  render: ->
    <PromiseRenderer promise={@getProject()}>{ ([project]) =>
      <ProjectStatus project={project} />
    }</PromiseRenderer>
