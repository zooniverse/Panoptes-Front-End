React = require 'react'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
WorkflowTasksEditor = require '../../components/workflow-tasks-editor'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'
BoundResourceMixin = require '../../lib/bound-resource-mixin'
{Navigation} = require 'react-router'
tasks = require '../../classifier/tasks'

EditWorkflowPage = React.createClass
  displayName: 'EditWorkflowPage'

  mixins: [BoundResourceMixin, Navigation]

  boundResource: 'workflow'

  getDefaultProps: ->
    workflow: null

  getInitialState: ->
    selectedTaskKey: @props.workflow.first_task
    reloadCellectError: false
    reloadCellectInProgress: false

  render: ->
    <div className="columns-container">
      <div className="column">
        <div>
          <div>
            <span className="form-label">Workflow title</span>
            <br />
            <input type="text" name="display_name" value={@props.workflow.display_name} className="standard-input full" onChange={@handleChange} />
            <span className="form-help"><small>Version {@props.workflow.version}</small></span>
          </div>

          <br />

          <div>
            <div className="nav-list standalone">
              <span className="nav-list-header">Tasks</span>
              <br />
              {for key, definition of @props.workflow.tasks
                classNames = ['secret-button', 'nav-list-item']
                if key is @state.selectedTaskKey
                  classNames.push 'active'
                <div key={key}>
                  <button type="button" className={classNames.join ' '} onClick={@setState.bind this, selectedTaskKey: key, null}>
                    {switch definition.type
                      when 'single' then <i className="fa fa-dot-circle-o fa-fw"></i>
                      when 'multiple' then <i className="fa fa-check-square-o fa-fw"></i>
                      when 'drawing' then <i className="fa fa-pencil fa-fw"></i>}
                    {' '}
                    {tasks[definition.type].getTaskText definition}
                    {if key is @props.workflow.first_task
                      <em> (first)</em>}
                  </button>
                </div>}
            </div>

            Add task{' '}
            <button type="button" className="pill-button" onClick={@addNewTask.bind this, 'single'}><strong>Question</strong></button>{' '}
            <button type="button" className="pill-button" onClick={@addNewTask.bind this, 'drawing'}><strong>Drawing</strong></button>
          </div>

          {unless @props.project.private
            <p className="form-help warning">You’re editing a workflow on a public project. <strong>Please note that any changes will result in the loss of your existing classifications for this workflow!</strong></p>}

          <p><button type="button" className="standard-button" disabled={@state.saveInProgress or not @props.workflow.hasUnsavedChanges()} data-busy={@state.saveInProgress || null} onClick={@saveResource}>Save changes</button> {@renderSaveStatus()}</p>
        </div>

        <hr />

        <div>
          <span className="form-label">Associated subject sets</span>
          <p className="form-help">NOTE: Assigning subject sets doesn’t quite work as expected right now. To-do on the back end.</p>
          {@renderSubjectSets()}
        </div>

        <hr />

        <div>
          <button type="button" className="minor-button" disabled={@state.reloadCellectInProgress} data-busy={@state.reloadCellectInProgress || null} onClick={@reloadCellect}>Reload Cellect</button>{' '}
          {if @state.reloadCellectError
            <span className="form-help error">There was an error reloading cellect</span>}
          <p className="form-help">Reload Cellect after you’ve modified an associated subject set. TODO: Call this automatically when adding to a subject set.</p>
        </div>

        <hr />

        <div>
          <small>
            <button type="button" className="minor-button" disabled={@state.deleteInProgress} data-busy={@state.deleteInProgress || null} onClick={@deleteResource.bind this, @afterDelete}>
              Delete this workflow
            </button>
          </small>{' '}
          {if @state.deleteError?
            <span className="form-help error">{@state.deleteError.message}</span>}
        </div>
      </div>


      <div className="column">
        {if @state.selectedTaskKey? and @props.workflow.tasks[@state.selectedTaskKey]?
          TaskEditorComponent = tasks[@props.workflow.tasks[@state.selectedTaskKey].type].Editor
          <TaskEditorComponent workflow={@props.workflow} task={@props.workflow.tasks[@state.selectedTaskKey]} onChange={@handleTaskChange.bind this, @state.selectedTaskKey} />
        else
          <p>Choose a task to edit</p>}
      </div>
    </div>

  renderSubjectSets: ->
    projectAndWorkflowSubjectSets = Promise.all [
      @props.project.get 'subject_sets'
      @props.workflow.get 'subject_sets'
      # TODO: @props.workflow.get 'expert_subject_set'
    ]

    <PromiseRenderer promise={projectAndWorkflowSubjectSets}>{([projectSubjectSets, workflowSubjectSets, expertSubjectSet]) =>
      <table>
        {for subjectSet in projectSubjectSets
          assigned = subjectSet in workflowSubjectSets
          cantChange = subjectSet is expertSubjectSet or subjectSet.id is @props.workflow.links.expert_subject_set
          toggle = @handleSubjectSetToggle.bind this, subjectSet
          <tr key={subjectSet.id}>
            <td><input type="checkbox" checked={assigned} disabled={cantChange} onChange={toggle} /></td>
            <td>{subjectSet.display_name}</td>
          </tr>}
      </table>
    }</PromiseRenderer>

  addNewTask: (type) ->
    taskCount = Object.keys(@props.workflow.tasks).length

    # Task IDs aren't displayed anywhere.
    # This could be random, but we might as well make it sorta meaningful.
    taskIDNumber = -1
    until nextTaskID? and nextTaskID not of @props.workflow.tasks
      taskIDNumber += 1
      nextTaskID = "T#{taskCount + taskIDNumber}"

    changes = {}
    changes["tasks.#{nextTaskID}"] = tasks[type].getDefaultTask()
    unless @props.workflow.first_task
      changes.first_task = nextTaskID

    @props.workflow.update changes
    @setState selectedTaskKey: nextTaskID

  handleSubjectSetToggle: (subjectSet, e) ->
    # TODO: This is totally untested; I have no idea if this is right.
    if e.target.checked
      @props.workflow.addLink 'subject_sets', [subjectSet.id]
    else
      @props.workflow.removeLink 'subject_sets', subjectSet.id

  reloadCellect: ->
    reloadEndpoint = apiClient.root + ['', 'workflows', @props.workflow.id, 'reload_cellect'].join '/'
    @setState
      reloadCellectError: false
      reloadCellectInProgress: true
    apiClient.post ['', 'workflows', @props.workflow.id, 'reload_cellect'].join '/'
      .catch (error) =>
        @setState reloadCellectError: true
      .then =>
        @setState reloadCellectInProgress: false

  afterDelete: ->
    @props.project.uncacheLink 'workflows'
    @transitionTo 'edit-project-details', projectID: @props.project.id

  handleTaskChange: (taskKey, path, value) ->
    changes = {}
    changes["tasks.#{taskKey}.#{path}"] = value
    @props.workflow.update changes

module.exports = React.createClass
  displayName: 'EditWorkflowPageWrapper'

  mixins: [BoundResourceMixin]

  boundResource: ->
    @_workflow

  getDefaultProps: ->
    params: null

  render: ->
    <PromiseRenderer promise={apiClient.type('workflows').get @props.params.workflowID}>{(workflow) =>
      @_workflow = workflow
      <ChangeListener target={workflow}>{=>
        <EditWorkflowPage {...@props} workflow={workflow} />
      }</ChangeListener>
    }</PromiseRenderer>
