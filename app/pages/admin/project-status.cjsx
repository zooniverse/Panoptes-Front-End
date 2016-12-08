React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require 'panoptes-client/lib/api-client'
SetToggle = require '../../lib/set-toggle'
moment = require 'moment'
ChangeListener = require '../../components/change-listener'
ProjectIcon = require '../../components/project-icon'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'
getWorkflowsInOrder = require '../../lib/get-workflows-in-order'
WorkflowToggle = require '../../components/workflow-toggle'

`import VersionList from './project-status/version-list';`
`import ExperimentalFeatures from './project-status/experimental-features';`

ProjectToggle = React.createClass
  displayName: "ProjectToggle"

  mixins: [SetToggle]

  getDefaultProps: ->
    project: null
    field: null
    trueLabel: "True"
    falseLabel: "False"

  getInitialState: ->
    error: null
    setting: {}

  setterProperty: 'project'

  render: ->
    setting = @props.project[@props.field]
    <span>
      <label style={whiteSpace: 'nowrap'}>
        <input type="radio" name={@props.field} value={true} data-json-value={true} checked={setting} disabled={@state.setting.private} onChange={@set.bind this, @props.field, true} />
        {@props.trueLabel}
      </label>
      &emsp;
      <label style={whiteSpace: 'nowrap'}>
        <input type="radio" name={@props.field} value={false} data-json-value={true} checked={not setting} disabled={@state.setting.private} onChange={@set.bind this, @props.field, false} />
        {@props.falseLabel}
      </label>
    </span>

ProjectRedirectToggle = React.createClass
  displayName: "ProjectRedirectToggle"

  mixins: [SetToggle]

  getDefaultProps: ->
    project: null
    validUrlRegex: /https?:\/\/[\w-]+(\.[\w-]*)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/
    invalidUrl: "invalidUrl"

  getInitialState: ->
    error: null

  updateRedirect:  (e) ->
    _redirectUrl = this.refs.redirectUrl.value
    if _redirectUrl?.match(@props.validUrlRegex) || _redirectUrl == ""
      handleInputChange.call(@props.project, e)
    else
      @setState(error: @props.invalidUrl)

  validUrlMessage: ->
    if @state.error == @props.invalidUrl
      "Invalid URL - must be in https?://format"

  render: ->
    <div className="project-status__section">
      <h4>Project Redirect</h4>
      <AutoSave resource={@props.project}>
        <input type="text" name="redirect" ref="redirectUrl" value={@props.project.redirect} placeholder="External redirect" onBlur={@updateRedirect} onChange={handleInputChange.bind @props.project} />
        <span>{ @validUrlMessage() }</span>
      </AutoSave>
    </div>

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
            <li>Private: <ProjectToggle project={@props.project} field="private" trueLabel="Private" falseLabel="Public" /></li>
            <li>Live: <ProjectToggle project={@props.project} field="live" trueLabel="Live" falseLabel="Development" /></li>
            <li>Beta Requested: <ProjectToggle project={@props.project} field="beta_requested" /></li>
            <li>Beta Approved: <ProjectToggle project={@props.project} field="beta_approved" /></li>
            <li>Launch Requested: <ProjectToggle project={@props.project} field="launch_requested" /></li>
            <li>Launch Approved: <ProjectToggle project={@props.project} field="launch_approved" /></li>
          </ul>
        </div>
        <ProjectRedirectToggle project={@props.project} />
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
