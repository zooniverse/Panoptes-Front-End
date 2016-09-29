React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
ChangeListener = require '../components/change-listener'
FrameAnnotator = require './frame-annotator'
SubjectViewer = require '../components/subject-viewer'
ClassificationSummary = require './classification-summary'
{Link} = require 'react-router'
tasks = require './tasks'
{getSessionID} = require '../lib/session'
preloadSubject = require '../lib/preload-subject'
TriggeredModalForm = require 'modal-form/triggered'
TutorialButton = require './tutorial-button'
isAdmin = require '../lib/is-admin'
Tutorial = require '../lib/tutorial'
workflowAllowsFlipbook = require '../lib/workflow-allows-flipbook'
workflowAllowsSeparateFrames = require '../lib/workflow-allows-separate-frames'
WorldWideTelescope = require './world_wide_telescope'
MiniCourseButton = require './mini-course-button'
GridTool = require './drawing-tools/grid'
Intervention = require '../lib/intervention'
experimentsClient = require '../lib/experiments-client'
interventionMonitor = require '../lib/intervention-monitor'
`import CacheClassification from '../components/cache-classification'`

Classifier = React.createClass
  displayName: 'Classifier'

  contextTypes:
    geordi: React.PropTypes.object

  propTypes:
    user: React.PropTypes.object
    workflow: React.PropTypes.object
    subject: React.PropTypes.object
    classification: React.PropTypes.object
    onLoad: React.PropTypes.func

  getDefaultProps: ->
    user: null
    workflow: null
    subject: null
    classification: null
    onLoad: Function.prototype
    cacheClassification: new CacheClassification

  getInitialState: ->
    backButtonWarning: false
    expertClassification: null
    selectedExpertAnnotation: -1
    showingExpertClassification: false
    subjectLoading: false
    renderIntervention: false

  disableIntervention: ->
    @setState renderIntervention: false

  enableIntervention: ->
    experimentsClient.logExperimentState @context.geordi, interventionMonitor?.latestFromSugar, "interventionDetected"
    @setState renderIntervention: true

  componentDidMount: ->
    experimentsClient.startOrResumeExperiment interventionMonitor, @context.geordi
    @setState renderIntervention: interventionMonitor?.shouldShowIntervention()
    interventionMonitor.on 'interventionRequested', @enableIntervention
    interventionMonitor.on 'classificationTaskRequested', @disableIntervention
    @loadSubject @props.subject
    @prepareToClassify @props.classification
    {workflow, project, preferences, user} = @props
    Tutorial.startIfNecessary {workflow, user, preferences}

  componentWillReceiveProps: (nextProps) ->
    if nextProps.project isnt @props.project or nextProps.user isnt @props.user
      {workflow, project, user, preferences} = nextProps
      Tutorial.startIfNecessary {workflow, user, preferences} if preferences?
    if nextProps.subject isnt @props.subject
      @loadSubject subject
    if nextProps.classification isnt @props.classification
      @prepareToClassify nextProps.classification
    if @props.subject isnt nextProps.subject or !@context.geordi?.keys["subjectID"]?
      @context.geordi?.remember subjectID: nextProps.subject?.id

  componentWillMount: () ->
    interventionMonitor.setProjectSlug @props.project.slug

  componentWillUnmount: () ->
    interventionMonitor.removeListener 'interventionRequested', @enableIntervention
    interventionMonitor.removeListener 'classificationTaskRequested', @disableIntervention
    try
      @context.geordi?.forget ['subjectID']

  loadSubject: (subject) ->
    @setState
      expertClassification: null
      selectedExpertAnnotation: -1
      showingExpertClassification: false
      subjectLoading: true

    if @props.project.experimental_tools.indexOf('expert comparison summary') > -1
      @getExpertClassification @props.workflow, @props.subject

    preloadSubject subject
      .then =>
        if @props.subject is subject # The subject could have changed while we were loading.
          @setState subjectLoading: false
          @props.onLoad?()

  getExpertClassification: (workflow, subject) ->
    awaitExpertClassification = Promise.resolve do =>
      apiClient.get('/classifications/gold_standard', {
        workflow_id: workflow.id,
        subject_ids: [subject.id]
      })
        .catch ->
          []
        .then ([expertClassification]) ->
          expertClassification

    awaitExpertClassification.then (expertClassification) =>
      expertClassification ?= subject.expert_classification_data?[workflow.id]
      if @props.workflow is workflow and @props.subject is subject
        window.expertClassification = expertClassification
        @setState {expertClassification}

  prepareToClassify: (classification) ->
    classification.annotations ?= []
    if classification.annotations.length is 0
      @addAnnotationForTask classification, @props.workflow.first_task

  render: ->
    largeFormatImage = @props.workflow.configuration.image_layout and 'no-max-height' in @props.workflow.configuration.image_layout
    classifierClassNames = if largeFormatImage then "classifier large-image" else "classifier"

    <ChangeListener target={@props.classification}>{=>
      if @state.showingExpertClassification
        currentClassification = @state.expertClassification
      else
        currentClassification = @props.classification
        unless @props.classification.completed
          currentAnnotation = currentClassification.annotations[currentClassification.annotations.length - 1]
          currentTask = @props.workflow.tasks[currentAnnotation?.task]

      # This is just easy access for debugging.
      window.classification = currentClassification

      <div className={classifierClassNames} >
        <SubjectViewer
          user={@props.user}
          project={@props.project}
          subject={@props.subject}
          workflow={@props.workflow}
          preferences={@props.preferences}
          classification={currentClassification}
          annotation={currentAnnotation}
          onLoad={@handleSubjectImageLoad}
          frameWrapper={FrameAnnotator}
          allowFlipbook={workflowAllowsFlipbook @props.workflow}
          allowSeparateFrames={workflowAllowsSeparateFrames @props.workflow}
          onChange={@handleAnnotationChange.bind this, currentClassification}
        />

        <div className="task-area">
          {if currentTask?
            @renderTask currentClassification, currentAnnotation, currentTask
          else if @subjectIsGravitySpyGoldStandard()
            @renderGravitySpyGoldStandard currentClassification
          else if not @props.workflow.configuration?.hide_classification_summaries # Classification is complete; show summary if enabled
            @renderSummary currentClassification}
        </div>
      </div>
    }</ChangeListener>

  renderTask: (classification, annotation, task) ->
    TaskComponent = tasks[task.type]

    # Should we disable the "Back" button?
    onFirstAnnotation = classification.annotations.indexOf(annotation) is 0

    # Should we disable the "Next" or "Done" buttons?
    if TaskComponent.isAnnotationComplete?
      waitingForAnswer = not TaskComponent.isAnnotationComplete task, annotation, @props.workflow

    # Each answer of a single-answer task can have its own `next` key to override the task's.
    if TaskComponent is tasks.single
      currentAnswer = task.answers?[annotation.value]
      nextTaskKey = currentAnswer?.next
    else
      nextTaskKey = task.next

    unless @props.workflow.tasks[nextTaskKey]?
      nextTaskKey = ''

    # TODO: Actually disable things that should be.
    # For now we'll just make them non-mousable.
    disabledStyle =
      opacity: 0.5
      pointerEvents: 'none'

    # Run through the existing annotations to build up sets of persistent hooks in the order of the associated annotations. Skip duplicates.
    persistentHooksBeforeTask = []
    persistentHooksAfterTask = []
    classification.annotations.forEach (annotation) =>
      taskDescription = @props.workflow.tasks[annotation.task]
      TaskComponent = tasks[taskDescription.type]
      {PersistBeforeTask, PersistAfterTask} = TaskComponent
      if PersistBeforeTask? and PersistBeforeTask not in persistentHooksBeforeTask
        persistentHooksBeforeTask.push PersistBeforeTask
      if PersistAfterTask? and PersistAfterTask not in persistentHooksAfterTask
        persistentHooksAfterTask.push PersistAfterTask

    # These props will be passed into the hooks. Append as necessary when creating hooks.
    taskHookProps =
      taskTypes: tasks
      workflow: @props.workflow
      classification: classification
      onChange: -> classification.update()

    <div className="task-container" style={disabledStyle if @state.subjectLoading}>
      {if @state.renderIntervention
        <Intervention
            user={@props.user}
            experimentName={interventionMonitor?.latestFromSugar["experiment_name"]}
            sessionID={getSessionID()}
            interventionID={interventionMonitor?.latestFromSugar["next_event"]}
            interventionDetails={experimentsClient.constructInterventionFromSugarData interventionMonitor?.latestFromSugar}
            disableInterventionFunction={@disableIntervention}
          />}
        <div className="coverable-task-container">
          {persistentHooksBeforeTask.map (HookComponent, i) =>
            key = i + Math.random()
            <HookComponent key={key} {...taskHookProps} />}

          <TaskComponent autoFocus={true} taskTypes={tasks} workflow={@props.workflow} task={task} preferences={@props.preferences} annotation={annotation} onChange={@handleAnnotationChange.bind this, classification} />

          {persistentHooksAfterTask.map (HookComponent, i) =>
            key = i + Math.random()
            <HookComponent key={key} {...taskHookProps} />}

          <hr />

          <nav className="task-nav">
            {if Object.keys(@props.workflow.tasks).length > 1
              <button type="button" className="back minor-button" disabled={onFirstAnnotation} onClick={@destroyCurrentAnnotation} onMouseEnter={@warningToggleOn} onFocus={@warningToggleOn} onMouseLeave={@warningToggleOff} onBlur={@warningToggleOff}>Back</button>}
            {if not nextTaskKey and @props.workflow.configuration?.hide_classification_summaries and @props.owner? and @props.project?
              [ownerName, name] = @props.project.slug.split('/')
              <Link onClick={@completeClassification} to="/projects/#{ownerName}/#{name}/talk/subjects/#{@props.subject.id}" className="talk standard-button" style={if waitingForAnswer then disabledStyle}>Done &amp; Talk</Link>}
            {if nextTaskKey
              <button type="button" className="continue major-button" disabled={waitingForAnswer} onClick={@addAnnotationForTask.bind this, classification, nextTaskKey}>Next</button>
            else
              <button type="button" className="continue major-button" disabled={waitingForAnswer} onClick={@completeClassification}>
                {if @props.demoMode
                  <i className="fa fa-trash fa-fw"></i>
                else if @props.classification.gold_standard
                  <i className="fa fa-star fa-fw"></i>}
                {' '}Done
              </button>}
            {@renderExpertOptions()}
          </nav>
          { @renderBackButtonWarning() if @state.backButtonWarning }

          <p>
            <small>
              <strong>
                <TutorialButton className="minor-button" user={@props.user} workflow={@props.workflow} project={@props.project} style={marginTop: '2em'}>
                  Show the project tutorial
                </TutorialButton>
              </strong>
            </small>
          </p>

          <p>
            <small>
              <strong>
                <MiniCourseButton className="minor-button" user={@props.user} preferences={@props.preferences} project={@props.project} workflow={@props.workflow} style={marginTop: '2em'}>
                  Restart the project mini-course
                </MiniCourseButton>
              </strong>
            </small>
          </p>

          {if @props.demoMode
            <p style={textAlign: 'center'}>
              <i className="fa fa-trash"></i>{' '}
              <small>
                <strong>Demo mode:</strong>
                <br />
                No classifications are being recorded.{' '}
                <button type="button" className="secret-button" onClick={@props.onChangeDemoMode.bind null, false}>
                  <u>Disable</u>
                </button>
              </small>
            </p>
          else if @props.classification.gold_standard
            <p style={textAlign: 'center'}>
              <i className="fa fa-star"></i>{' '}
              <small>
                <strong>Gold standard mode:</strong>
                <br />
                Please ensure this classification is completely accurate.{' '}
                <button type="button" className="secret-button" onClick={@props.classification.update.bind @props.classification, gold_standard: undefined}>
                  <u>Disable</u>
                </button>
              </small>
            </p>}
        </div>
    </div>

  renderSummary: (classification) ->
    <div>
      Thanks!

      {if @props.workflow.configuration.custom_summary and 'world_wide_telescope' in @props.workflow.configuration.custom_summary
        <strong>
          <WorldWideTelescope
            annotations={@props.classification.annotations}
            subject={@props.subject}
            workflow={@props.workflow}
          />
        </strong>

      else if @state.expertClassification?
        <div className="has-expert-classification">
          Expert classification available.{' '}
          {if @state.showingExpertClassification
            <button type="button" onClick={@toggleExpertClassification.bind this, false}>Hide</button>
          else
            <button type="button" onClick={@toggleExpertClassification.bind this, true}>Show</button>}
        </div>}

      <div>
        <strong>
          {if @state.showingExpertClassification
            'Expert classification:'
          else
            'Your classification:'}
        </strong>
        <ClassificationSummary workflow={@props.workflow} classification={classification} />
      </div>

      <hr />

      <nav className="task-nav">
        {if @props.owner? and @props.project?
          [ownerName, name] = @props.project.slug.split('/')
          <Link onClick={@props.onClickNext} to="/projects/#{ownerName}/#{name}/talk/subjects/#{@props.subject.id}" className="talk standard-button">Talk</Link>}
        <button type="button" autoFocus={true} className="continue major-button" onClick={@props.onClickNext}>Next</button>
        {@renderExpertOptions()}
      </nav>
    </div>

  renderExpertOptions: ->
    return unless @props.expertClassifier
    <TriggeredModalForm trigger={
      <i className="fa fa-cog fa-fw"></i>
    }>
      {if 'owner' in @props.userRoles or 'expert' in @props.userRoles
        <p>
          <label>
            <input type="checkbox" checked={@props.classification.gold_standard} onChange={@handleGoldStandardChange} />{' '}
            Gold standard mode
          </label>{' '}
          <TriggeredModalForm trigger={
            <i className="fa fa-question-circle"></i>
          }>
            <p>A “gold standard” classification is one that is known to be completely accurate. We’ll compare other classifications against it during aggregation.</p>
          </TriggeredModalForm>
        </p>}

        {if isAdmin() or 'owner' in @props.userRoles or 'collaborator' in @props.userRoles
          <p>
            <label>
              <input type="checkbox" checked={@props.demoMode} onChange={@handleDemoModeChange} />{' '}
              Demo mode
            </label>{' '}
            <TriggeredModalForm trigger={
              <i className="fa fa-question-circle"></i>
            }>
              <p>In demo mode, classifications <strong>will not be saved</strong>. Use this for quick, inaccurate demos of the classification interface.</p>
            </TriggeredModalForm>
          </p>}
    </TriggeredModalForm>

  renderGravitySpyGoldStandard: (classification) ->
    choiceLabels = []
    for annotation in classification.annotations when @props.workflow.tasks[annotation.task].type is 'survey'
      for value in annotation.value
        choiceLabels.push @props.workflow.tasks[annotation.task].choices[value.choice].label
    match = choiceLabels.every (label) => label is @props.subject.metadata['#Label']

    <div>
    {if match
      <div>
        <p>Good work!</p>
        <p>When our experts classified this image,<br />they also thought it was a {@props.subject.metadata['#Label']}!</p>
        {if choiceLabels.length > 1
          <p>You should only assign 1 label.</p>}
      </div>
    else
      <div>
        <p>You responded {choiceLabels.join(', ')}.</p>
        {if choiceLabels.length > 1
          <p>You should only assign 1 label.</p>}
        <p>When our experts classified this image,<br />they labeled it as a {@props.subject.metadata['#Label']}.</p>
        <p>Some of the glitch classes can look quite similar,<br />so please keep trying your best.</p>
        <p>Check out the tutorial and the field guide for more guidance.</p>
      </div>}


      <hr />

      <nav className="task-nav">
        {if @props.owner? and @props.project?
          [ownerName, name] = @props.project.slug.split('/')
          <Link onClick={@props.onClickNext} to="/projects/#{ownerName}/#{name}/talk/subjects/#{@props.subject.id}" className="talk standard-button">Talk</Link>}
        <button type="button" autoFocus={true} className="continue major-button" onClick={@props.onClickNext}>Next</button>
      </nav>
    </div>

  # Whenever a subject image is loaded in the annotator, record its size at that time.
  handleSubjectImageLoad: (e, frameIndex) ->
    @context.geordi?.remember subjectID: @props.subject?.id

    {naturalWidth, naturalHeight, clientWidth, clientHeight} = e.target
    changes = {}
    changes["metadata.subject_dimensions.#{frameIndex}"] = {naturalWidth, naturalHeight, clientWidth, clientHeight}
    @props.classification.update changes

  handleAnnotationChange: (classification, newAnnotation) ->
    classification.annotations[classification.annotations.length - 1] = newAnnotation
    classification.update 'annotations'

  # Next (or start):
  addAnnotationForTask: (classification, taskKey) ->
    taskDescription = @props.workflow.tasks[taskKey]
    annotation = tasks[taskDescription.type].getDefaultAnnotation taskDescription, @props.workflow, tasks
    annotation.task = taskKey

    if @props.workflow.configuration.persist_annotations
      cachedAnnotation = @props.cacheClassification.isAnnotationCached(taskKey)
      if cachedAnnotation?
        annotation = cachedAnnotation

    classification.annotations.push annotation
    classification.update 'annotations'

  # Back up:
  destroyCurrentAnnotation: ->
    lastAnnotation = @props.classification.annotations[@props.classification.annotations.length - 1]

    @props.classification.annotations.pop()
    @props.classification.update 'annotations'

    if @props.workflow.configuration.persist_annotations
      @props.cacheClassification.update(lastAnnotation)

  completeClassification: ->
    if @props.workflow.configuration.persist_annotations
      @props.cacheClassification.delete()
    
    currentAnnotation = @props.classification.annotations[@props.classification.annotations.length - 1]
    currentTask = @props.workflow.tasks[currentAnnotation?.task]
    currentTask?.tools?.map (tool) =>
      if tool.type is 'grid'
        GridTool.mapCells @props.classification.annotations

    @props.classification.update
      completed: true
      'metadata.session': getSessionID()
      'metadata.finished_at': (new Date).toISOString()
      'metadata.viewport':
        width: innerWidth
        height: innerHeight

    if @props.workflow.configuration?.hide_classification_summaries and not @subjectIsGravitySpyGoldStandard()
      @props.onCompleteAndLoadAnotherSubject?()
    else
      @props.onComplete?()
      .then (classification) =>
        # after classification is saved, if we are in an experiment and logged in, notify experiment server to advance the session plan
        experimentName = experimentsClient.checkForExperiment(@props.project.slug)
        if experimentName? and @props.user
          experimentsClient.postDataToExperimentServer interventionMonitor,
                                                       @context.geordi,
                                                       experimentName, @props.user?.id,
                                                       classification.metadata.session,
                                                       "classification",classification.id
      , (error) =>
        console.log error

  handleGoldStandardChange: (e) ->
    @props.classification.update gold_standard: e.target.checked || undefined # Delete the whole key.

  handleDemoModeChange: (e) ->
    @props.onChangeDemoMode e.target.checked

  toggleExpertClassification: (value) ->
    @setState showingExpertClassification: value

  warningToggleOn: ->
    @setState backButtonWarning: true unless @props.workflow.configuration.persist_annotations

  warningToggleOff: ->
    @setState backButtonWarning: false

  renderBackButtonWarning: ->
    <p className="back-button-warning" >Going back will clear your work for the current task.</p>

  subjectIsGravitySpyGoldStandard: ->
    @props.workflow.configuration?.gravity_spy_gold_standard and @props.subject.metadata?['#Type'] is 'Gold'

module.exports = React.createClass
  displayName: 'ClassifierWrapper'

  propTypes:
    classification: React.PropTypes.object
    onLoad: React.PropTypes.func
    onComplete: React.PropTypes.func
    onCompleteAndLoadAnotherSubject: React.PropTypes.func
    onClickNext: React.PropTypes.func
    workflow: React.PropTypes.object
    user: React.PropTypes.object

  getDefaultProps: ->
    classification: {}
    onLoad: Function.prototype
    onComplete: Function.prototype
    onCompleteAndLoadAnotherSubject: Function.prototype
    onClickNext: Function.prototype
    workflow: null
    user: null

  getInitialState: ->
    subject: null
    expertClassifier: null
    userRoles: []

  componentDidMount: ->
    @checkExpertClassifier()
    @loadClassification @props.classification

  componentWillReceiveProps: (nextProps) ->
    if @props.user isnt nextProps.user
      @setState expertClassifier: null
      @checkExpertClassifier nextProps

    unless nextProps.classification is @props.classification
      @loadClassification nextProps.classification

  loadClassification: (classification) ->
    @setState subject: null

    # TODO: These underscored references are temporary stopgaps.

    Promise.resolve(classification._subjects ? classification.get 'subjects').then ([subject]) =>
      # We'll only handle one subject per classification right now.
      # TODO: Support multi-subject classifications in the future.
      @setState {subject}

  checkExpertClassifier: (props = @props) ->
    if props.project and props.user and @state.expertClassifier is null
      getUserRoles = props.project.get('project_roles', user_id: props.user.id)
        .then (projectRoles) =>
          getProjectRoleHavers = Promise.all projectRoles.map (projectRole) =>
            projectRole.get 'owner'
          getProjectRoleHavers
            .then (projectRoleHavers) =>
              (projectRoles[i].roles for user, i in projectRoleHavers when user is props.user)
            .then (setsOfUserRoles) =>
              [[], setsOfUserRoles...].reduce (set, next) =>
                set.concat next

      getUserRoles.then (userRoles) =>
        expertClassifier = isAdmin() or 'owner' in userRoles or 'collaborator' in userRoles or 'expert' in userRoles
        @setState {expertClassifier, userRoles}

  render: ->
    if @props.workflow? and @state.subject?
      <Classifier {...@props}
        workflow={@props.workflow}
        subject={@state.subject}
        expertClassifier={@state.expertClassifier}
        userRoles={@state.userRoles} />
    else
      <span>Loading classifier...</span>
