React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
handleInputChange = require('../../lib/handle-input-change').default
PromiseRenderer = require '../../components/promise-renderer'
TriggeredModalForm = require 'modal-form/triggered'
ModalFormDialog = require 'modal-form/dialog'
apiClient = require 'panoptes-client/lib/api-client'
ChangeListener = require '../../components/change-listener'
RetirementRulesEditor = require '../../components/retirement-rules-editor'
{Link} = require 'react-router'
MultiImageSubjectOptionsEditor = require '../../components/multi-image-subject-options-editor'
tasks = require('../../classifier/tasks').default
AutoSave = require '../../components/auto-save'
FileButton = require '../../components/file-button'
WorkflowCreateForm = require './workflow-create-form'
workflowActions = require './actions/workflow'
classnames = require 'classnames'
ShortcutEditor = require('../../classifier/tasks/shortcut/editor').default
FeedbackSection = require('../../features/feedback/lab').default
MobileSection = require('./mobile').default

DEMO_SUBJECT_SET_ID = if process.env.NODE_ENV is 'production'
  '6' # Cats
else
  '1166' # Ghosts

EditWorkflowPage = createReactClass
  displayName: 'EditWorkflowPage'

  contextTypes:
    router: PropTypes.object.isRequired

  getDefaultProps: ->
    workflow: null
    workflowActions: workflowActions

  getInitialState: ->
    selectedTaskKey: @props.workflow.first_task
    forceReloader: 0
    deletionInProgress: false
    deletionError: null
    workflowCreationInProgress: false

  workflowLink: ->
    [owner, name] = @props.project.slug.split('/')
    viewQuery = workflow: @props.workflow.id, reload: @state.forceReloader
    @context.router.createHref
      pathname: "/projects/#{owner}/#{name}/classify"
      query: viewQuery

  showCreateWorkflow: ->
    @setState workflowCreationInProgress: true

  hideCreateWorkflow: ->
    @setState workflowCreationInProgress: false

  handleWorkflowCreation: (workflow) ->
    @hideCreateWorkflow()
    newLocation = Object.assign {}, @props.location, pathname: "/lab/#{@props.project.id}/workflows/#{workflow.id}"
    @context.router.push newLocation
    @props.project.uncacheLink 'workflows'
    @props.project.uncacheLink 'subject_sets' # An "expert" subject set is automatically created with each workflow.

  canUseTask: (project, task)->
    task in project.experimental_tools

  handleTaskChange: (taskKey, taskDescription) ->
    changes = {}
    changes["tasks.#{taskKey}"] = taskDescription
    @props.workflow.update(changes).save()

  isThereNotADefinedTask: () ->
    workflowTasks = Object.keys(@props.workflow.tasks)
    workflowTasks.length is 0

  render: ->
    window.editingWorkflow = @props.workflow

    noTasksDefined = Object.keys(@props.workflow.tasks).length is 0

    stats_completeness_type = @props.workflow.configuration.stats_completeness_type ? 'retirement'

    projectLiveWorkflowActive = @props.project.live and @props.workflow.active
    projectLiveWorkflowInactive = @props.project.live and !@props.workflow.active
    disabledIfLive = classnames({ 'disabled-section': projectLiveWorkflowActive })
    disabledIfWorkflowInactive = classnames({ 'disabled-section': projectLiveWorkflowInactive })
    taskEditorClasses = classnames({'column': true, 'disabled-section': projectLiveWorkflowActive})

    <div className="edit-workflow-page">
      <h3>{@props.workflow.display_name} #{@props.workflow.id}{' '}
        <button onClick={@showCreateWorkflow} disabled={@state.workflowCreationInProgress} title="Copy workflow">
          <i className="fa fa-copy"/>
        </button>
      </h3>
      {if @state.workflowCreationInProgress
        <ModalFormDialog tag="div">
          <WorkflowCreateForm onSubmit={@props.workflowActions.createWorkflowForProject} onCancel={@hideCreateWorkflow} onSuccess={@handleWorkflowCreation}  projectID={@props.project.id} workflowToClone={@props.workflow} workflowActiveStatus={not @props.project.live} />
        </ModalFormDialog>}
      <p className="form-help">A workflow is the sequence of tasks that you’re asking volunteers to perform. For example, you might want to ask volunteers to answer questions about your images, or to mark features in your images, or both.</p>
      {if @props.project.live and @props.workflow.active
        <p className="form-help warning">
          <strong>
            You cannot edit tasks for an active workflow on a live project, all the task fields below will be inactive.
            <br />
            To edit these fields, deactivate your workflow on the <Link to="/lab/#{@props.project.id}/workflows">worfklows page</Link> - do not change your project to development.
          </strong>
        </p>}
      <div className="columns-container">
        <div className="column">
          <div>
            <AutoSave tag="label" resource={@props.workflow}>
              <span className="form-label">Workflow title</span>
              <br />
              <input type="text" name="display_name" value={@props.workflow.display_name} className="standard-input full" onChange={handleInputChange.bind @props.workflow} />
            </AutoSave>
            <small className="form-help">If you let your volunteers choose which workflow to attempt, this text will appear as an option on the project front page.</small>

            <br />

            <div className={disabledIfLive}>
              <div className="nav-list standalone">
                <span className="nav-list-header">Tasks</span>
                <br />
                {if noTasksDefined
                  <div className="nav-list-item">
                    <small className="form-help">(No tasks yet)</small>
                  </div>
                else
                  for key, definition of @props.workflow.tasks
                    unless definition.type is 'shortcut'
                      classNames = ['secret-button', 'nav-list-item']
                      taskDefinition = tasks[definition.type]?.getTaskText definition
                      if key is @state.selectedTaskKey
                        classNames.push 'active'
                      <div key={key}>
                        <button
                          type="button"
                          className={classNames.join ' '}
                          onClick={@setState.bind this, selectedTaskKey: key, null}
                        >
                          {switch definition.type
                            when 'single' then <i className="fa fa-dot-circle-o fa-fw"></i>
                            when 'multiple' then <i className="fa fa-check-square-o fa-fw"></i>
                            when 'drawing' then <i className="fa fa-pencil fa-fw"></i>
                            when 'survey' then <i className="fa fa-binoculars fa-fw"></i>
                            when 'flexibleSurvey' then <i className="fa fa-binoculars fa-fw"></i>
                            when 'crop' then <i className="fa fa-crop fa-fw"></i>
                            when 'text' then <i className="fa fa-file-text-o fa-fw"></i>
                            when 'dropdown' then <i className="fa fa-list fa-fw"></i>
                            when 'combo' then <i className="fa fa-cubes fa-fw"></i>
                            when 'slider' then <i className="fa fa-sliders fa-fw"></i>
                            when 'highlighter' then <i className="fa fa-i-cursor"></i>}
                          {' '}
                          {taskDefinition || 'Task editor is unavailable'}
                          {if key is @props.workflow.first_task
                            <small> <em>(first)</em></small>}
                          <small style={{float: 'right'}}>{key}</small>
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
                  <AutoSave resource={@props.workflow}>
                    <button type="submit" className="minor-button" onClick={@addNewTask.bind this, 'text'} title="Text tasks: the volunteer writes free-form text into a dialog box.">
                      <i className="fa fa-file-text-o fa-2x"></i>
                      <br />
                      <small><strong>Text</strong></small>
                    </button>
                  </AutoSave>{' '}
                  <AutoSave resource={@props.workflow}>
                    <button type="submit" className="minor-button" onClick={@addNewTask.bind this, 'survey'} title="Survey tasks: the volunteer identifies objects (usually animals) in the image(s) by filtering by their visible charactaristics, then answers questions about them.">
                      <i className="fa fa-binoculars fa-2x"></i>
                      <br />
                      <small><strong>Survey</strong></small>
                    </button>
                  </AutoSave>{' '}
                  {if @canUseTask(@props.project, "highlighter")
                    <AutoSave resource={@props.workflow}>
                      <button type="submit" className="minor-button" onClick={@addNewTask.bind this, 'highlighter'} title="Highlighter: The volunteer can highlight piece of text.">
                        <i className="fa fa-i-cursor fa-2x"></i>
                        <br />
                        <small><strong>Highlighter</strong></small>
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
                  {if @canUseTask(@props.project, "dropdown")
                      <AutoSave resource={@props.workflow}>
                        <button type="submit" className="minor-button" onClick={@addNewTask.bind this, 'dropdown'} title="Dropdown tasks: the volunteer selects an option from a list. Conditional dropdowns can be created, and if a research team enables the feature, a volunteer can enter text if the answer they'd like to provide is not an option available.">
                          <i className="fa fa-list fa-2x"></i>
                          <br />
                          <small><strong>Dropdown</strong></small>
                        </button>
                      </AutoSave>}{' '}
                  {if @canUseTask(@props.project, "combo")
                    <AutoSave resource={@props.workflow}>
                      <button type="submit" className="minor-button" onClick={@addNewTask.bind this, 'combo'} title="Combo tasks: show a bunch of tasks at the same time.">
                        <i className="fa fa-cubes fa-2x"></i>
                        <br />
                        <small><strong>Combo</strong></small>
                      </button>
                    </AutoSave>}{' '}
                  {if @canUseTask(@props.project, "slider")
                    <AutoSave resource={@props.workflow}>
                      <button type="submit" className="minor-button" onClick={@addNewTask.bind this, 'slider'} title="Slider tasks: the volunteer uses a slider to select a numeric value.">
                        <i className="fa fa-sliders fa-2x"></i>
                        <br />
                        <small><strong>Slider</strong></small>
                      </button>
                    </AutoSave>}
                </TriggeredModalForm>
              </p>

              <AutoSave tag="div" resource={@props.workflow}>
                <small>First task</small>{' '}
                <select name="first_task" value={@props.workflow.first_task} disabled={noTasksDefined} onChange={handleInputChange.bind @props.workflow}>
                  {if noTasksDefined
                    <option>(No tasks yet)</option>
                  else
                    for taskKey, definition of @props.workflow.tasks
                      unless definition.type is 'shortcut'
                        <option key={taskKey} value={taskKey}>{tasks[definition.type]?.getTaskText definition}</option>}
                </select>
              </AutoSave>
            </div>

            <p className="form-help"><small>A task is a unit of work you are asking volunteers to do. You can ask them to answer a question or mark an image. Add a task by clicking the question or marking buttons below.</small></p>

            <hr />

            <p>
              <small className="form-help">Version {@props.workflow.version} - Status: <span className={if @props.workflow.active then "color-label green" else "color-label red"}>{if @props.workflow.active then "Active" else "Inactive"}</span></small>
            </p>
            <p className="form-help"><small>Version indicates which version of the workflow you are on. Every time you save changes to a workflow, you create a new version. Big changes, like adding or deleting questions, will change the version by a whole number: 1.0 to 2.0, etc. Smaller changes, like modifying the help text, will change the version by a decimal, e.g. 2.0 to 2.1. The version is tracked with each classification in case you need it when analyzing your data.</small></p>
            <p className="form-help"><small>Status indicates whether a workflow is active or inactive. Active workflows are available to volunteers and classifications count toward subject retirement. Workflow status can be managed under the Visibility section within the Project Builder.</small></p>
          </div>

          <hr />

          <div>
            <span className="form-label">Associated subject sets</span><br />
            <small className="form-help">Choose the set of subjects you want to use for this workflow.</small>
            {@renderSubjectSets()}
          </div>

          <hr />

          <div>
            <AutoSave resource={@props.workflow}>
            <span className="form-label">Set annotation persistence</span><br />
            <small className="form-help">Save the annotation of the task you are on when the back button is clicked.</small>
            <br />
            <label>
              <input ref="persistAnnotation" type="checkbox" checked={@props.workflow.configuration.persist_annotations} onChange={@handlePersistAnnotationsToggle} />
              Persist annotations
            </label>
            </AutoSave>
            <hr />
          </div>

          <div className={disabledIfWorkflowInactive}>
            <AutoSave resource={@props.project}>
              <span className="form-label">Set as default</span><br />
              <small className="form-help">If you have more than one workflow, you can set which should be default. Only one can be default.</small>
              {<span><br /><small className="form-help">Inactive workflows on live projects cannot be made default.</small></span> if projectLiveWorkflowInactive}
              <br />
              <label>
                <input ref="defaultWorkflow" type="checkbox" disabled={projectLiveWorkflowInactive} checked={@props.project.configuration?.default_workflow is @props.workflow.id} onChange={@handleDefaultWorkflowToggle} />
                Default workflow
              </label>
            </AutoSave>
          </div>

          <hr />

          <div ref="link-tutorials-section">
            <span className="form-label">Associated tutorial {"and/or mini-course" if 'mini-course' in @props.project.experimental_tools}</span><br />
            <small className="form-help">Choose the tutorial {"and/or mini-course" if 'mini-course' in @props.project.experimental_tools} you want to use for this workflow.</small><br />
            <small className="form-help">Only one can be associated with a workflow at a time.</small>
            <div>
              {@renderTutorials()}
              {@renderMiniCourses() if 'mini-course' in @props.project.experimental_tools}
            </div>
          </div>

          <hr />

          <div>
            <div>
              <AutoSave resource={@props.workflow}>
                <span className="form-label">Classification summaries</span><br />
                <small className="form-help">Classification summaries show the user how they have answered/marked for each task once the classification is complete</small>
                <br />
                <label>
                  <input ref="hideClassificationSummaries" type="checkbox" checked={@props.workflow.configuration.hide_classification_summaries} onChange={@handleSetHideClassificationSummaries} />
                  Hide classification summaries
                </label>
              </AutoSave>
            </div>

            <hr />
          </div>

          {if 'sim notification' in @props.project.experimental_tools
            <div>
              <div>
                <AutoSave resource={@props.workflow}>
                  <span className="form-label">Simulation subject notification</span><br />
                  <small className="form-help">Simulation subject notification will display a small message in the classification summary that lets the volunteer know the subject is a simulation.</small><br /><br />
                  <small className="form-help">For this feature to work, it requires hidden subject metadata with the column label <code>{'#sim'}</code> and the value set to <code>true</code> or <code>false.</code></small>
                  <br />
                  <label>
                    <input type="checkbox" checked={@props.workflow.configuration.sim_notification} onChange={@handleSetSimNotification} />
                    Simluation subject notification
                  </label>
                </AutoSave>
              </div>

              <hr />
            </div>}

          {if 'Gravity Spy Gold Standard' in @props.project.experimental_tools
            <div>
              <div>
                <AutoSave resource={@props.workflow}>
                  <span className="form-label">Gravity Spy Gold Standard</span><br />
                  <small className="form-help">Notify a user how they've classified a Gold Standard subject.</small>
                  <br />
                  <label>
                    <input type="checkbox" onChange={@handleSetGravitySpyGoldStandard} checked={@props.workflow.configuration.gravity_spy_gold_standard}/>
                    Gravity Spy Gold Standard
                  </label>
                </AutoSave>
              </div>

              <hr />

            </div>}

          <div>
            <div>
              <AutoSave resource={@props.workflow}>
                <span className="form-label">Pan and zoom</span><br />
                <small className="form-help">Pan and zoom allows the user to zoom in and out and pan image subjects in the classification interface.</small>
                <br />
                <label>
                  <input ref="panAndZoomToggle" type="checkbox" checked={@props.workflow.configuration.pan_and_zoom} onChange={@handleSetPanAndZoom} />
                  Pan and Zoom
                </label>
              </AutoSave>
            </div>

            <hr />
          </div>

          <AutoSave tag="div" resource={@props.workflow}>
            <span className="form-label">Multi-image options</span><br />
            <small className="form-help">Choose how to display multiple images</small>
            <MultiImageSubjectOptionsEditor workflow={@props.workflow} />
          </AutoSave>

          <hr />

          {if 'enable subject flags' in @props.project.experimental_tools
            <div>
              <div>
                <AutoSave resource={@props.workflow}>
                  <span className="form-label">Subject Flags</span><br />
                  <small className="form-help">Flags allow volunteers to mark subjects as inappropriate.</small>
                  <br />
                  <label>
                    <input type="checkbox" onChange={@enableSubjectFlags} checked={@props.workflow.configuration.enable_subject_flags}/>
                    Enable Subject Flags
                  </label>
                </AutoSave>
              </div>

              <hr />

            </div>}

          <div>
            <AutoSave tag="label" resource={@props.workflow}>
              <input type="checkbox" name="invert_subject" checked={@props.workflow.configuration.invert_subject} onChange={@handleSetInvert} />
              Allow Users To Flip Image Color
            </AutoSave>

            <hr />
          </div>

          <p>
            <AutoSave resource={@props.workflow}>
              Subject retirement <RetirementRulesEditor workflow={@props.workflow} />
            </AutoSave>
            <br />
            <small className="form-help">How many people should classify each subject before it is “done”? Once a subject has reached the retirement limit it will no longer be shown to any volunteers.</small>
            <br />
            <br />
            <small className="form-help">If you'd like more complex retirement rules, please get in touch via the <a href='/about/contact'>Contact Us</a> page.</small>
          </p>

          <hr />

          {if 'worldwide telescope' in @props.project.experimental_tools
            <div>
              <div>
                <AutoSave resource={@props.workflow}>
                  <span className="form-label">Use World Wide Telescope API</span><br />
                  <small className="form-help">Allow user to view subject in the WWT after classifying.</small>
                  <br />
                  <label htmlFor="world_wide_telescope_summary">
                    <input type="checkbox" onChange={@handleSetWorldWideTelescope} checked={@telescopeValue()}/>
                    WorldWide Telescope
                  </label>
                </AutoSave>
              </div>

              <hr />

            </div>}

          <div className={if @isThereNotADefinedTask() then 'disabled-section' else ''}>
            {if not @isThereNotADefinedTask()
              <a
                href={@workflowLink()}
                className="standard-button"
                target="from-lab"
                onClick={@handleViewClick}
              >
                Test this workflow
              </a>}
            {if @isThereNotADefinedTask()
              <div>
                <span className="standard-button">Test this workflow</span>
                <p>You need to add a task and content to be able to test this workflow.</p>
              </div>}
          </div>

          <hr />

          <div className={disabledIfLive}>
            <small>
              <button type="button" className="minor-button" disabled={@state.deletionInProgress} data-busy={@state.deletionInProgress || null} onClick={@handleDelete}>
                Delete this workflow
              </button>
            </small>{' '}
            {if @state.deletionError?
              <span className="form-help error">{@state.deletionError.message}</span>}
          </div>
        </div>

        <div className={taskEditorClasses}>
          {if @state.selectedTaskKey? and @props.workflow.tasks[@state.selectedTaskKey]?
            TaskEditorComponent = tasks[@props.workflow.tasks[@state.selectedTaskKey].type]?.Editor
            <div>
              {if 'shortcut' in @props.project.experimental_tools
                <ShortcutEditor workflow={@props.workflow} task={@props.workflow.tasks[@state.selectedTaskKey]} >
                  <TaskEditorComponent
                    workflow={@props.workflow}
                    task={@props.workflow.tasks[@state.selectedTaskKey]}
                    taskPrefix="tasks.#{@state.selectedTaskKey}"
                    project={@props.project}
                    onChange={@handleTaskChange.bind this, @state.selectedTaskKey}
                  />
                </ShortcutEditor>
              else if TaskEditorComponent
                <TaskEditorComponent
                  workflow={@props.workflow}
                  task={@props.workflow.tasks[@state.selectedTaskKey]}
                  taskPrefix="tasks.#{@state.selectedTaskKey}"
                  project={@props.project}
                  onChange={@handleTaskChange.bind this, @state.selectedTaskKey}
                />
              else 
                <div>Editor is not available.</div>}
              <hr />
              <br />

              {if 'general feedback' in @props.project.experimental_tools
                <FeedbackSection
                  task={@props.workflow.tasks[@state.selectedTaskKey]}
                  saveFn={@handleTaskChange.bind this, @state.selectedTaskKey}
                />}
              <hr />
              <br />

              <MobileSection
                project={@props.project}
                workflow={@props.workflow}
                task={@props.workflow.tasks[@state.selectedTaskKey]}
              />

              <AutoSave resource={@props.workflow}>
                <small>
                  <button type="button" className="minor-button" onClick={@handleTaskDelete.bind this, @state.selectedTaskKey}>Delete this task</button>
                </small>
              </AutoSave>
            </div>
          else
            <div className="form-help">
              <p>Choose a task to edit. The configuration for that task will appear here.</p>
            </div>}
        </div>
      </div>
    </div>

  renderSubjectSets: ->
    projectAndWorkflowSubjectSets = Promise.all [
      @props.project.get 'subject_sets', sort: 'display_name', page_size: 250
      @props.workflow.get 'subject_sets', sort: 'display_name', page_size: 250
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
                <td>{subjectSet.display_name} (#{subjectSet.id})</td>
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

  renderTutorials: ->
    projectAndWorkflowTutorials = Promise.all [
      apiClient.type('tutorials').get project_id: @props.project.id, page_size: 100
      apiClient.type('tutorials').get workflow_id: @props.workflow.id, page_size: 100
    ]
    <PromiseRenderer promise={projectAndWorkflowTutorials}>{([projectTutorials, workflowTutorials]) =>
      # Backwards compatibility with tutorials with null kind values
      tutorials = projectTutorials.filter((value)-> value if value.kind is 'tutorial' or value.kind is null)
      workflowTutorial = tutorials.filter((value) -> value if value in workflowTutorials)[0]
      if tutorials.length > 0
        <form className="workflow-link-tutorials-form">
          <span className="form-label">Tutorials</span>
          <label>
            <input name="tutorial" type="radio" value="" checked={!workflowTutorial} onChange={@removeTutorial.bind this, workflowTutorial, workflowTutorials} />
            No tutorial
          </label>
          {for tutorial in tutorials
            assignedTutorial = tutorial is workflowTutorial
            toggleTutorial = @handleTutorialToggle.bind this, tutorial, workflowTutorials
            <label key={tutorial.id}>
              <input name="tutorial" type="radio" checked={assignedTutorial} value={tutorial.id} onChange={toggleTutorial} />
              Tutorial #{tutorial.id} {" - #{tutorial.display_name}" if tutorial.display_name}
            </label>}
        </form>
      else
        <span>This project has no tutorials.</span>
    }</PromiseRenderer>

  renderMiniCourses: ->
    projectAndWorkflowTutorials = Promise.all [
      apiClient.type('tutorials').get project_id: @props.project.id, page_size: 100, kind: 'mini-course'
      apiClient.type('tutorials').get workflow_id: @props.workflow.id, page_size: 100, kind: 'mini-course'
    ]
    <PromiseRenderer promise={projectAndWorkflowTutorials}>{([projectTutorials, workflowTutorials]) =>
      workflowMiniCourse = projectTutorials.filter((value) -> value if value in workflowTutorials)[0]
      if projectTutorials.length > 0
        <form className="workflow-link-tutorials-form">
          <span className="form-label">Mini-Courses</span>
          <label>
            <input name="minicourse" type="radio" value="" checked={!workflowMiniCourse} onChange={@removeTutorial.bind this, workflowMiniCourse, workflowTutorials} />
            No mini-course
          </label>
          {for tutorial in projectTutorials
            assignedTutorial = tutorial is workflowMiniCourse
            toggleTutorial = @handleTutorialToggle.bind this, tutorial, workflowTutorials
            <label key={tutorial.id}>
              <input name="minicourse" type="radio" checked={assignedTutorial} onChange={toggleTutorial} />
              Mini-Course #{tutorial.id} {" - #{tutorial.display_name}" if tutorial.display_name}
            </label>}
        </form>
      else
        <span>This project has no mini-courses.</span>
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

  handleSetPanAndZoom: (e) ->
    @props.workflow.update
      'configuration.pan_and_zoom': e.target.checked

  handleSetHideClassificationSummaries: (e) ->
    @props.workflow.update
      'configuration.hide_classification_summaries': e.target.checked

  handlePersistAnnotationsToggle: (e) ->
    @props.workflow.update
      'configuration.persist_annotations': e.target.checked

  handleSetSimNotification: (e) ->
    @props.workflow.update
      'configuration.sim_notification': e.target.checked

  handleSetInvert: (e) ->
    @props.workflow.update
      'configuration.invert_subject': e.target.checked

  handleSetGravitySpyGoldStandard: (e) ->
    @props.workflow.update
      'configuration.gravity_spy_gold_standard': e.target.checked

  enableSubjectFlags: (e) ->
    @props.workflow.update
      'configuration.enable_subject_flags': e.target.checked

  handleSetWorldWideTelescope: (e) ->
    if !@props.workflow.configuration.custom_summary
      @props.workflow.update
        'configuration.custom_summary' : []
    summary_path = @props.workflow.configuration.custom_summary
    if e.target.checked
    then summary_path.push('world_wide_telescope')
    else
      index = summary_path.indexOf('world_wide_telescope')
      summary_path.splice(index, 1)
    @props.workflow.update
      'configuration.custom_summary' : summary_path

  telescopeValue: ->
    if @props.workflow.configuration.custom_summary
      'world_wide_telescope' in @props.workflow.configuration.custom_summary

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

  handleDefaultWorkflowToggle: (e) ->
    shouldSet = e.target.checked

    if shouldSet
      @props.project.update 'configuration.default_workflow': @props.workflow.id
      @props.project.save()
    else
      @props.project.update 'configuration.default_workflow': undefined
      @props.project.save()

  handleTutorialToggle: (tutorial, workflowTutorials, e) ->
    shouldAdd = e.target.checked

    ensureSaved = if @props.workflow.hasUnsavedChanges()
      @props.workflow.save()
    else
      Promise.resolve()

    ensureSaved
      .then =>
        if shouldAdd
          @props.workflow.addLink 'tutorials', [tutorial.id]

          for workflowTutorial in workflowTutorials
            if workflowTutorial.kind is null and tutorial.kind is 'tutorial' or workflowTutorial.kind is 'tutorial' and tutorial.kind is null
              @props.workflow.removeLink 'tutorials', workflowTutorial.id if workflowTutorial.id isnt tutorial.id
            else if workflowTutorial.kind is tutorial.kind
              @props.workflow.removeLink 'tutorials', workflowTutorial.id if workflowTutorial.id isnt tutorial.id
        else
          @props.workflow.removeLink 'tutorials', tutorial.id

  removeTutorial: (tutorial, workflowTutorials, e) ->
    @props.workflow.removeLink 'tutorials', tutorial.id

  addDemoSubjectSet: ->
    @props.project.uncacheLink 'subject_sets'
    @props.workflow.addLink 'subject_sets', [DEMO_SUBJECT_SET_ID]

  handleDelete: ->
    @setState deletionError: null

    confirmed = confirm 'Really delete this workflow and all its tasks?'

    if confirmed
      @setState deletionInProgress: true

      if @props.workflow.id is @props.project.configuration?.default_workflow
        @props.project.update 'configuration.default_workflow': undefined
        @props.project.save()

      @props.workflow.delete().then =>
        @props.project.uncacheLink 'workflows'
        @context.router.push "/lab/#{@props.project.id}"
      .catch (error) =>
        @setState deletionError: error
      .then =>
        if @isMounted()
          @setState deletionInProgress: false

  handleViewClick: ->
    setTimeout =>
      @setState forceReloader: @state.forceReloader + 1

  handleTaskDelete: (taskKey, e) ->
    shortcut = @props.workflow.tasks[taskKey].unlinkedTask
    if e.shiftKey or confirm 'Really delete this task?'
      changes = {}
      if shortcut
        changes["tasks.#{shortcut}"] = undefined
      changes["tasks.#{taskKey}"] = undefined
      @props.workflow.update changes

      if @props.workflow.first_task not of @props.workflow.tasks
        @props.workflow.update first_task: Object.keys(@props.workflow.tasks)[0] ? ''

module.exports = createReactClass
  displayName: 'EditWorkflowPageWrapper'

  getDefaultProps: ->
    params:
      workflowID: ''

  render: ->
    <PromiseRenderer promise={apiClient.type('workflows').get @props.params.workflowID, {}}>{(workflow) =>
      <ChangeListener target={workflow}>{=>
        <EditWorkflowPage {...@props} workflow={workflow} />
      }</ChangeListener>
    }</PromiseRenderer>
