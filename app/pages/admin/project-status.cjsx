React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require 'panoptes-client/lib/api-client'
SetToggle = require '../../lib/set-toggle'
{Link} = require 'react-router'
moment = require 'moment'
TagSearch = require '../../components/tag-search'
ChangeListener = require '../../components/change-listener'
ProjectIcon = require '../../components/project-icon'
AutoSave = require '../../components/auto-save'
{DISCIPLINES} = require '../../components/disciplines'
Select = require 'react-select'
handleInputChange = require '../../lib/handle-input-change'

EXPERIMENTAL_FEATURES = [
  'survey'
  'crop'
  'text'
  'combo'
  'dropdown'
  'tutorial'
  'field guide'
  'mini-course'
  'hide classification summaries'
  'pan and zoom'
  'worldwide telescope'
  'hide previous marks'
  'column'
]

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

ProjectExperimentalFeatures = React.createClass
  displayName: "ProjectExperimentalFeatures"

  getDefaultProps: ->
    project: null

  setting: (task) ->
    task in (@props.project?.experimental_tools or [])

  handleDisciplineTagChange: (value) ->
    newTags = if value is '' then [] else value.split(',')
    @setState disciplineTagList: newTags
    allTags = newTags.concat @state.otherTagList
    @handleTagChange(allTags)

  handleOtherTagChange: (value) ->
    newTags = if value is '' then [] else value.split(',')
    @setState otherTagList: newTags
    allTags = @state.disciplineTagList.concat newTags
    @handleTagChange(allTags)

  handleTagChange: (value) ->
    event =
      target:
        value: value
        name: 'tags'
        dataset: {}
    handleInputChange.call @props.project, event

  splitTags: (kind) ->
    disciplineTagList = []
    otherTagList = []
    for t in @props.project.tags
      if DISCIPLINES.some((el) -> el.value == t)
        disciplineTagList.push(t)
      else
        otherTagList.push(t)
    {disciplineTagList, otherTagList}

  getInitialState: ->
    {disciplineTagList, otherTagList} = @splitTags()
    error: null
    setting: {}
    disciplineTagList: disciplineTagList
    otherTagList: otherTagList

  updateTasks: (task) ->
    tools = @props.project.experimental_tools or []
    if task in tools
      tools.splice(tools.indexOf(task), 1)
    else
      tools = tools.concat([task])
    @props.project.update({experimental_tools: tools})

  render: ->
    <div className="project-status__section">
      <h4>Experimental Features</h4>
      <AutoSave resource={@props.project}>
        <div className="project-status__section-table">
          {EXPERIMENTAL_FEATURES.map (task) =>
            <label key={task} className="project-status__section-table-row">
              <input type="checkbox" name={task} checked={@setting(task)} onChange={@updateTasks.bind @, task} />
              {task.charAt(0).toUpperCase() + task.slice(1)}
            </label>}
        </div>
      </AutoSave>
      <br />
      <h4>Project Tags</h4>
      <AutoSave resource={@props.project}>
        <span className="form-label">Discipline Tag</span>
        <br />
        <Select
          ref="disciplineSelect"
          name="disciplines"
          placeholder="Add Discipline Tag"
          className="discipline-tag"
          value={@state.disciplineTagList}
          options={DISCIPLINES}
          multi={true}
          onChange={@handleDisciplineTagChange} />
        <small className="form-help">Enter or select one or more discipline tags to identify which field(s) of research your project belongs to. These tags will determine the categories your project will appear under on the main Zooniverse projects page, if your project becomes a full Zooniverse project. </small>
      </AutoSave>
      <br />
      <AutoSave resource={@props.project}>
        <span className="form-label">Other Tags</span>
        <br />
        <TagSearch name="tags" multi={true} value={@state.otherTagList} onChange={@handleOtherTagChange} />
        <small className="form-help">Enter a list of additional tags to describe your project separated by commas to help users find your project.</small>
      </AutoSave>
    </div>

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

VersionList = React.createClass
  displayName: "VersionList"

  getDefaultProps: ->
    project: null

  render: ->
    <PromiseRenderer promise={@props.project.get 'versions'}>{ (versions) =>
      vs = versions.sort()
      <h4>Recent Status Changes</h4>
      <ul className="project-status__section-list">
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

ProjectStatus = React.createClass
  displayName: "ProjectStatus"

  getDefaultProps: ->
    project: null

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
        <ProjectExperimentalFeatures project={@props.project} />
        <div className="project-status__section">
          <h4>Workflow Settings</h4>
          <PromiseRenderer promise={@props.project.get('workflows')}>{(workflows) =>
            if workflows.length is 0
              <div className="workflow-status-list">No workflows found</div>
            else
              <div className="workflow-status-list">
                <ul className="project-status__section-list">
                  {workflows.map (workflow) =>
                    <li key={workflow.id}>
                      <WorkflowToggle workflow={workflow} project={@props.project} field="active" />
                    </li>}
                </ul>
             </div>
          }</PromiseRenderer>
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
