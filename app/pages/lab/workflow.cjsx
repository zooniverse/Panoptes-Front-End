React = require 'react'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
TriggeredModalForm = require 'modal-form/triggered'
WorkflowTasksEditor = require '../../components/workflow-tasks-editor'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'
RetirementRulesEditor = require '../../components/retirement-rules-editor'
{Navigation} = require '@edpaget/react-router'
tasks = require '../../classifier/tasks'
AutoSave = require '../../components/auto-save'

DEMO_SUBJECT_SET_ID = if process.env.NODE_ENV is 'production'
  '6' # Cats
else
  '1166' # Ghosts

EditWorkflowPage = React.createClass
  displayName: 'EditWorkflowPage'

  mixins: [Navigation]

  getDefaultProps: ->
    workflow: null

  getInitialState: ->
    selectedTaskKey: @props.workflow.first_task
    forceReloader: 0

  workflowLink: ->
    [owner, name] = @props.project.slug.split('/')
    viewParams = {owner, name}
    viewQuery = workflow: @props.workflow.id, reload: @state.forceReloader
    @makeHref 'project-classify', viewParams, viewQuery

  canUseTask: (project, task)->
    task in project.experimental_tools

  render: ->
    window.editingWorkflow = @props.workflow

    disabledStyle =
      opacity: 0.4
      pointerEvents: 'none'

    <div className="edit-workflow-page">
      <h3>{@props.workflow.display_name} #{@props.workflow.id}</h3>
      <p className="form-help">A workflow is the sequence of tasks that you’re asking volunteers to perform. For example, you might want to ask volunteers to answer questions about your images, or to mark features in your images, or both.</p>
      {if @props.project.live
        <p className="form-help warning"><strong>You cannot edit a project’s workflows once it’s gone live.</strong></p>}
      <div className="columns-container" style={disabledStyle if @props.project.live}>
        <div className="column">
          <div>
            <AutoSave tag="label" resource={@props.workflow}>
              <span className="form-label">Workflow title</span>
              <br />
              <input type="text" name="display_name" value={@props.workflow.display_name} className="standard-input full" onChange={handleInputChange.bind @props.workflow} />
            </AutoSave>
            <small className="form-help">If you let your volunteers choose which workflow to attempt, this text will appear as an option on the project front page.</small>

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
                        when 'drawing' then <i className="fa fa-pencil fa-fw"></i>
                        when 'survey' then <i className="fa fa-binoculars fa-fw"></i>
                        when 'crop' then <i className="fa fa-crop fa-fw"></i>
                        when 'text' then <i className="fa fa-file-text-o fa-fw"></i>}
                      {' '}
                      {tasks[definition.type].getTaskText definition}
                      {if key is @props.workflow.first_task
                        <small> <em>(first)</em></small>}
                    </button>
                  </div>}
              </div>

              <p>
                <TriggeredModalForm trigger={
                  <span className="standard-button">
                    <i className="fa fa-plus-circle"></i>{' '}
                    Add a task
                  </span>
                }>
                  <AutoSave resource={@props.workflow}>
                    <button type="submit" className="minor-button" onClick={@addNewTask.bind this, 'single'} title="Question tasks: the volunteer chooses from among a list of answers but does not mark or draw on the image(s).">
                      <i className="fa fa-question-circle fa-2x"></i>
                      <br />
                      <small><strong>Question</strong></small>
                    </button>
                  </AutoSave>{' '}
                  <AutoSave resource={@props.workflow}>
                    <button type="submit" className="minor-button" onClick={@addNewTask.bind this, 'drawing'} title="Marking tasks: the volunteer marks or draws directly on the image(s) using tools that you specify. They can also give sub-classifications for each mark.">
                      <i className="fa fa-pencil fa-2x"></i>
                      <br />
                      <small><strong>Drawing</strong></small>
                    </button>
                  </AutoSave>{' '}
                  {if @canUseTask(@props.project, "text")
                    <AutoSave resource={@props.workflow}>
                      <button type="submit" className="minor-button" onClick={@addNewTask.bind this, 'text'} title="Text tasks: the volunteer writes free-form text into a dialog box.">
                        <i className="fa fa-file-text-o fa-2x"></i>
                        <br />
                        <small><strong>Text</strong></small>
                      </button>
                    </AutoSave>}{' '}
                  {if @canUseTask(@props.project, "survey")
                    <AutoSave resource={@props.workflow}>
                      <button type="submit" className="minor-button" onClick={@addNewTask.bind this, 'survey'} title="Survey tasks: the volunteer identifies objects (usually animals) in the image(s) by filtering by their visible charactaristics, then answers questions about them.">
                        <i className="fa fa-binoculars fa-2x"></i>
                        <br />
                        <small><strong>Survey</strong></small>
                      </button>
                    </AutoSave>}{' '}
                  {if @canUseTask(@props.project, "crop")
                    <AutoSave resource={@props.workflow}>
                      <button type="submit" className="minor-button" onClick={@addNewTask.bind this, 'crop'} title="Crop tasks: the volunteer draws a rectangle around an area of interest, and the view of the subject is approximately cropped to that area.">
                        <i className="fa fa-crop fa-2x"></i>
                        <br />
                        <small><strong>Crop</strong></small>
                      </button>
                    </AutoSave>}{' '}
                </TriggeredModalForm>
              </p>

              <AutoSave tag="div" resource={@props.workflow}>
                <small>First task</small>{' '}
                <select name="first_task" value={@props.workflow.first_task} onChange={handleInputChange.bind @props.workflow}>
                  {for taskKey, definition of @props.workflow.tasks
                    <option key={taskKey} value={taskKey}>{tasks[definition.type].getTaskText definition}</option>}
                </select>
              </AutoSave>
            </div>

            <p className="form-help"><small>A task is a unit of work you are asking volunteers to do. You can ask them to answer a question or mark an image. Add a task by clicking the question or marking buttons below.</small></p>

            <hr />

            <p>
              <small className="form-help">Version {@props.workflow.version}</small>
            </p>
            <p className="form-help"><small>Version indicates which version of the workflow you are on. Every time you save changes to a workflow, you create a new version. Big changes, like adding or deleting questions, will change the version by a whole number: 1.0 to 2.0, etc. Smaller changes, like modifying the help text, will change the version by a decimal, e.g. 2.0 to 2.1. The version is tracked with each classification in case you need it when analyzing your data.</small></p>
          </div>

          <hr />

          <div>
            <span className="form-label">Associated subject sets</span><br />
            <small className="form-help">Choose the set of subjects you want to use for this workflow.</small>
            {@renderSubjectSets()}
          </div>

          <hr />

          <p>
            <AutoSave resource={@props.workflow}>
              Subject retirement <RetirementRulesEditor workflow={@props.workflow} />
            </AutoSave>
            <br />
            <small className="form-help">How many people should classify each subject before it is “done”? Once a subject has reached the retirement limit it will no longer be shown to any volunteers.</small>
          </p>

          <hr />

          <div style={pointerEvents: 'all'}>
            <a href={@workflowLink()} className="standard-button" target="from-lab" onClick={@handleViewClick}>View this workflow</a>
          </div>

          <hr />

          <div>
            <small>
              <button type="button" className="minor-button" disabled={@state.deleteInProgress} data-busy={@state.deleteInProgress || null} onClick={@handleDelete}>
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
            <div>
              <TaskEditorComponent
                workflow={@props.workflow}
                task={@props.workflow.tasks[@state.selectedTaskKey]}
                taskPrefix="tasks.#{@state.selectedTaskKey}"
              />
              <hr />
              <br />
              <AutoSave resource={@props.workflow}>
                <small>
                  <button type="button" onClick={@handleTaskDelete.bind this, @state.selectedTaskKey}>Delete this task</button>
                </small>
              </AutoSave>
            </div>
          else
            <p>Choose a task to edit</p>}
        </div>
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
    @props.project.uncacheLink 'subject_sets'
    @props.workflow.addLink 'subject_sets', [DEMO_SUBJECT_SET_ID]

  handleDelete: ->
    @props.workflow.delete().then =>
      @props.project.uncacheLink 'workflows'
      @transitionTo 'edit-project-details', projectID: @props.project.id

  handleTaskChange: (taskKey, path, value) ->
    changes = {}
    changes["tasks.#{taskKey}.#{path}"] = value
    @props.workflow.update changes

  handleViewClick: ->
    setTimeout =>
      @setState forceReloader: @state.forceReloader + 1

  handleTaskDelete: (taskKey, e) ->
    if e.shiftKey or confirm 'Really delete this task?'
      changes = {}
      changes["tasks.#{taskKey}"] = undefined
      @props.workflow.update changes

      if @props.workflow.first_task not of @props.workflow.tasks
        @props.workflow.update first_task: Object.keys(@props.workflow.tasks)[0] ? ''

module.exports = React.createClass
  displayName: 'EditWorkflowPageWrapper'

  getDefaultProps: ->
    params:
      workflowID: ''

  render: ->
    <PromiseRenderer promise={apiClient.type('workflows').get @props.params.workflowID}>{(workflow) =>
      <ChangeListener target={workflow}>{=>
        <EditWorkflowPage {...@props} workflow={workflow} />
      }</ChangeListener>
    }</PromiseRenderer>
