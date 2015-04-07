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

  render: ->
    <div className="columns-container">
      <div className="column">
        <div>
          <div>
            Workflow title
            <br />
            <input type="text" name="display_name" value={@props.workflow.display_name} className="standard-input" onChange={@handleChange} />
          </div>

          <br />

          <div>
            <div className="nav-list standalone">
              <div className="nav-list-header">
                Tasks
              </div>
              {for key, definition of @props.workflow.tasks
                classNames = ['secret-button', 'nav-list-item']
                if key is @state.selectedTaskKey
                  classNames.push 'active'
                <div key={key}>
                  <button type="button" className={classNames.join ' '} onClick={@setState.bind this, selectedTaskKey: key, null}>{definition.question ? definition.instruction}</button>
                </div>}
            </div>
            <small>
              Add
              <button type="button" onClick={@addNewTask.bind this, 'single'}>Question</button>
              <button type="button" onClick={@addNewTask.bind this, 'drawing'}>Drawing</button>
            </small>
          </div>

          <br />

          <button type="button" className="standard-button" disabled={@state.saveInProgress or not @props.workflow.hasUnsavedChanges()} onClick={@saveResource}>Save changes</button> {@renderSaveStatus()}
        </div>

        <hr />

        <div>
          Associated subject sets
          <br />
          {@renderSubjectSets()}
        </div>

        <hr />

        <div>
          <small>
            <button type="button" className="minor-button" disabled={@state.deleteInProgress} onClick={@deleteResource.bind this, @afterDelete}>
              Delete this workflow
            </button>
          </small>{' '}
          {if @state.deleteError?
            <span className="form-help error">{@state.deleteError.message}</span>}
        </div>
      </div>

      <hr />

      <div className="column">
        {if @state.selectedTaskKey? and @props.workflow.tasks[@state.selectedTaskKey]?
          TaskEditorComponent = tasks[@props.workflow.tasks[@state.selectedTaskKey].type].Editor
          <TaskEditorComponent workflow={@props.workflow} taskKey={@state.selectedTaskKey} />
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

  afterDelete: ->
    @props.project.uncacheLink 'workflows'
    @transitionTo 'edit-project-details', projectID: @props.project.id

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
