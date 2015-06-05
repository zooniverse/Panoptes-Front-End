React = require 'react'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
WorkflowTasksEditor = require '../../components/workflow-tasks-editor'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'
BoundResourceMixin = require '../../lib/bound-resource-mixin'
RetirementRulesEditor = require '../../components/retirement-rules-editor'
{Navigation} = require 'react-router'
tasks = require '../../classifier/tasks'

DEMO_SUBJECT_SET_ID = if process.env.NODE_ENV is 'production'
  '6' # Cats
else
  '1166' # Ghosts

EditWorkflowPage = React.createClass
  displayName: 'EditWorkflowPage'

  mixins: [BoundResourceMixin, Navigation]

  boundResource: 'workflow'

  getDefaultProps: ->
    workflow: null

  getInitialState: ->
    selectedTaskKey: @props.workflow.first_task

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
                      <small> <em>(first)</em></small>}
                  </button>
                </div>}
            </div>

            <div>
              <small>Add task</small>{' '}
              <button type="button" className="pill-button" onClick={@addNewTask.bind this, 'single'}><strong>Question</strong></button>{' '}
              <button type="button" className="pill-button" onClick={@addNewTask.bind this, 'drawing'}><strong>Drawing</strong></button>
            </div>

            <div>
              <small>First task</small>{' '}
              <select name="first_task" value={@props.workflow.first_task} onChange={@handleChange}>
                {for taskKey, definition of @props.workflow.tasks
                  <option key={taskKey} value={taskKey}>{tasks[definition.type].getTaskText definition}</option>}
              </select>
            </div>
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
          <p>Subject retirement <RetirementRulesEditor workflow={@props.workflow} /></p>
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
          <TaskEditorComponent workflow={@props.workflow} task={@props.workflow.tasks[@state.selectedTaskKey]} onChange={@handleTaskChange.bind this, @state.selectedTaskKey} onDelete={@handleTaskDelete.bind this, @state.selectedTaskKey} />
        else
          <p>Choose a task to edit</p>}
      </div>
    </div>

  renderSubjectSets: ->
    projectAndWorkflowSubjectSets = Promise.all [
      @props.project.get 'subject_sets'
      @props.workflow.get 'subject_sets'
    ]

    <PromiseRenderer promise={projectAndWorkflowSubjectSets}>{([projectSubjectSets, workflowSubjectSets]) =>
      <div>
        <table>
          <tbody>
            {for subjectSet in projectSubjectSets
              assigned = subjectSet in workflowSubjectSets
              toggle = @handleSubjectSetToggle.bind this, subjectSet
              <tr key={subjectSet.id}>
                <td><input type="checkbox" checked={assigned} onChange={toggle} /></td>
                <td>{subjectSet.display_name}</td>
              </tr>}
          </tbody>
        </table>
        {if projectSubjectSets.length is 0
          <p>
            This project has no subject sets.{' '}
            <button type="button" onClick={@addDemoSubjectSet}>Add an example subject set</button>
          </p>}
      </div>
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
    shouldAdd = e.target.checked

    ensureSaved = if @props.workflow.hasUnsavedChanges()
      @props.workflow.save()
    else
      Promise.resolve()

    ensureSaved.then =>
      if shouldAdd
        @props.workflow.addLink 'subject_sets', [subjectSet.id]
      else
        @props.workflow.removeLink 'subject_sets', subjectSet.id

  addDemoSubjectSet: ->
    @props.project.addLink 'subject_sets', [DEMO_SUBJECT_SET_ID]
      .then =>
        @props.project.get 'subject_sets'
      .then ([subjectSet]) =>
        @props.workflow.addLink 'subject_sets', [subjectSet.id]

  afterDelete: ->
    @props.project.uncacheLink 'workflows'
    @transitionTo 'edit-project-details', projectID: @props.project.id

  handleTaskChange: (taskKey, path, value) ->
    changes = {}
    changes["tasks.#{taskKey}.#{path}"] = value
    @props.workflow.update changes

  handleTaskDelete: (taskKey) ->
    changes = {}
    changes["tasks.#{taskKey}"] = undefined
    @props.workflow.update changes

    if @props.workflow.first_task not of @props.workflow.tasks
      @props.workflow.update first_task: Object.keys(@props.workflow.tasks)[0] ? ''

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
