React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'
SetToggle = require '../../lib/set-toggle'
{Navigation, Link} = require '@edpaget/react-router'
moment = require 'moment'
ChangeListener = require '../../components/change-listener'
ProjectIcon = require '../../components/project-icon'

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

WorkflowToggle = React.createClass
  displayName: "WorkflowToggle"

  mixins: [SetToggle]

  getDefaultProps: ->
    workflow: null
    project: null
    field: null

  getInitialState: ->
    error: null
    setting: {}

  setterProperty: 'workflow'

  render: ->
    workflow = @props.workflow
    setting = workflow[@props.field]
    <span>
      { workflow.id } - { workflow.display_name}:
      <label style={whiteSpace: 'nowrap'}>
        <input type="checkbox" name={@props.field} value={setting} checked={setting} onChange={@set.bind this, @props.field, not setting} />
        Active
      </label>
    </span>

ProjectStatus = React.createClass
  displayName: "ProjectStatus"

  getDefaultProps: ->
    project: null

  render: ->
    <ChangeListener target={@props.project}>{ =>
      <div className="project-status">
        <ProjectIcon project={@props.project} />
        <h4>Settings</h4>
        <ul>
          <li>Private: <ProjectToggle project={@props.project} field="private" trueLabel="Private" falseLabel="Public" /></li>
          <li>Live: <ProjectToggle project={@props.project} field="live" trueLabel="Live" falseLabel="Development" /></li>
          <li>Beta Requested: <ProjectToggle project={@props.project} field="beta_requested" /></li>
          <li>Beta Approved: <ProjectToggle project={@props.project} field="beta_approved" /></li>
          <li>Launch Requested: <ProjectToggle project={@props.project} field="launch_requested" /></li>
          <li>Launch Approved: <ProjectToggle project={@props.project} field="launch_approved" /></li>
        </ul>
        <h4>Workflow Settings</h4>
        <PromiseRenderer promise={@props.project.get('workflows')}>{(workflows) =>
          if workflows.length is 0
            <div className="workflow-status-list">No workflows found</div>
          else
            <div className="workflow-status-list">
              <ul>
                {workflows.map (workflow) =>
                  <li key={workflow.id}>
                    <WorkflowToggle workflow={workflow} project={@props.project} field="active" />
                  </li>}
              </ul>
           </div>
        }</PromiseRenderer>
        <hr />
        <h4>Recent Status Changes</h4>
        <PromiseRenderer promise={@props.project.get 'versions', page_size: 10}>{ (versions) =>
          vs = versions.sort()
          <ul className="project-status-changes">
            {vs.map (version) =>
              key = Object.keys(version.changeset)[0]
              from = version.changeset[key][0].toString()
              to = version.changeset[key][1].toString()
              m = moment(version.created_at)
              <PromiseRenderer key={version.id} promise={apiClient.type('users').get(version.whodunnit)} >{ (user) =>
                <li>{user.display_name} changed {key} from {from} to {to} {m.fromNow()}</li>
              }</PromiseRenderer>}
          </ul>
        }</PromiseRenderer>
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
