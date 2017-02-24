React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
SubjectViewer = require '../components/subject-viewer'
`import ClassificationSummary from './classification-summary';`
{Link} = require 'react-router'
`import tasks from './tasks';`
preloadSubject = require '../lib/preload-subject'
TriggeredModalForm = require 'modal-form/triggered'
isAdmin = require '../lib/is-admin'
workflowAllowsFlipbook = require '../lib/workflow-allows-flipbook'
workflowAllowsSeparateFrames = require '../lib/workflow-allows-separate-frames'
GridTool = require './drawing-tools/grid'
experimentsClient = require '../lib/experiments-client'
interventionMonitor = require '../lib/intervention-monitor'
`import WorldWideTelescope from './world-wide-telescope';`
`import FrameAnnotator from './frame-annotator';`
`import CacheClassification from '../components/cache-classification';`
MetadataBasedFeedback = require './metadata-based-feedback'
`import Task from './task';`
{ VisibilitySplit } = require('seven-ten');
`import RestartButton from './restart-button';`
MiniCourse = require '../components/mini-course';
Tutorial = require '../components/tutorial';

# For easy debugging
window.cachedClassification = CacheClassification

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
    tutorial: React.PropTypes.object
    minicourse: React.PropTypes.object

  getDefaultProps: ->
    user: null
    workflow: null
    subject: null
    classification: null
    onLoad: Function.prototype
    tutorial: null
    minicourse: null

  getInitialState: ->
    backButtonWarning: false
    expertClassification: null
    selectedExpertAnnotation: -1
    showingExpertClassification: false
    subjectLoading: false
    renderIntervention: false
    annotations: []

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

  componentWillReceiveProps: (nextProps) ->
    if nextProps.subject isnt @props.subject
      @loadSubject nextProps.subject
    if @props.subject isnt nextProps.subject or !@context.geordi?.keys["subjectID"]?
      @context.geordi?.remember subjectID: nextProps.subject?.id
    
    if nextProps.classification isnt @props.classification
      @props.classification.stopListening 'change', =>
        {annotations} = @props.classification
        @setState {annotations}
      nextProps.classification.listen 'change', =>
        {annotations} = nextProps.classification
        @setState {annotations}
      @prepareToClassify nextProps.classification

  componentWillMount: () ->
    interventionMonitor.setProjectSlug @props.project.slug
    @props.classification.listen 'change', =>
      {annotations} = @props.classification
      @setState {annotations}

  componentWillUnmount: () ->
    interventionMonitor.removeListener 'interventionRequested', @enableIntervention
    interventionMonitor.removeListener 'classificationTaskRequested', @disableIntervention
    @props.classification.stopListening 'change', =>
      {annotations} = @props.classification
      @setState {annotations}
    try
      @context.geordi?.forget ['subjectID']

  loadSubject: (subject) ->
    @setState
      expertClassification: null
      selectedExpertAnnotation: -1
      showingExpertClassification: false
      subjectLoading: true

    if @props.project.experimental_tools?.indexOf('expert comparison summary') > -1
      @getExpertClassification @props.workflow, @props.subject

    @loadClassificationsCount subject

    preloadSubject subject
      .then =>
        if @props.subject is subject # The subject could have changed while we were loading.
          @setState subjectLoading: false
          @props.onLoad?()

  loadClassificationsCount: (subject) ->
    if @props.splits?['subject.first-to-classify']
      query =
        workflow_id: @props.workflow.id
        subject_id: subject.id

      apiClient.type('subject_workflow_statuses').get(query).then ([sws]) =>
        classificationCount = sws?.classifications_count or 0
        @setState {classificationCount}

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

    if @state.showingExpertClassification
      currentClassification = @state.expertClassification
    else
      currentClassification = @props.classification
      unless @props.classification.completed
        currentAnnotation = @state.annotations[@state.annotations.length - 1]
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
        playIterations={@props.workflow?.configuration.playIterations}
      />

      <div className="task-area">
        {if currentTask?
          <Task
            preferences={@props.preferences}
            user={@props.user}
            workflow={@props.workflow}
            classification={currentClassification}
            task={currentTask}
            annotation={currentAnnotation}
            addAnnotationForTask={@addAnnotationForTask}
            completeClassification={@completeClassification}
            handleAnnotationChange={@handleAnnotationChange.bind(this, currentClassification)}\
            renderExpertOptions={@renderExpertOptions}
            backButtonWarning={@state.backButtonWarning}
            renderBackButtonWarning={@renderBackButtonWarning}
            destroyCurrentAnnotation={@destroyCurrentAnnotation}
            warningToggleOn={@warningToggleOn}
            warningToggleOff={@warningToggleOff}
          >
            <p>
              <small>
                <strong>
                  <RestartButton
                    className="minor-button"
                    preferences={@props.preferences}
                    shouldRender={(@props.tutorial) && (@props.tutorial.steps.length > 0)}
                    start={Tutorial.start.bind(Tutorial, @props.tutorial, @props.user, @props.preferences, @context.geordi)}
                    style={{marginTop: '2em'}}
                    user={@props.user}
                    workflow={@props.workflow}
                  >
                    Show the project tutorial
                  </RestartButton>
                </strong>
              </small>
            </p>

            <p>
              <small>
                <strong>
                  <VisibilitySplit splits={@props.splits} splitKey={'mini-course.visible'} elementKey={'button'}>
                    <RestartButton
                      className="minor-button"
                      preferences={@props.preferences}
                      shouldRender={(@props.minicourse) && (@props.user) && (@props.minicourse.steps.length > 0)}
                      start={MiniCourse.restart.bind(MiniCourse, @props.minicourse, @props.preferences, @props.user, @context.geordi)}
                      style={{marginTop: '2em'}}
                      user={@props.user}
                      workflow={@props.workflow}
                    >
                      Restart the project mini-course
                    </RestartButton>
                  </VisibilitySplit>
                </strong>
              </small>
            </p>

            {if @props.demoMode
              <p style={{textAlign: 'center'}}>
                <i className="fa fa-trash"></i>{' '}
                <small>
                  <strong>Demo mode:</strong>
                  <br />
                  No classifications are being recorded.{' '}
                  <button type="button" className="secret-button" onClick={@onChangeDemoMode}>
                    <u>Disable</u>
                  </button>
                </small>
              </p>
            }
            {if @props.classification.gold_standard?
              <p style={{textAlign: 'center'}}>
                <i className="fa fa-star"></i>{' '}
                <small>
                  <strong>Gold standard mode:</strong>
                  <br />
                  Please ensure this classification is completely accurate.{' '}
                  <button type="button" className="secret-button" onClick={@props.classification.update.bind( @props.classification, {gold_standard: undefined})}>
                    <u>Disable</u>
                  </button>
                </small>
              </p>
            }
          </Task>
        else if @subjectIsGravitySpyGoldStandard()
          @renderGravitySpyGoldStandard currentClassification
        else if not @props.workflow.configuration?.hide_classification_summaries # Classification is complete; show summary if enabled
          @renderSummary currentClassification}
      </div>
    </div>
    

  renderSummary: (classification) ->
    disableTalk = @props.classification.metadata.subject_flagged?

    <div>
      Thanks!

      {if @props.project.experimental_tools?.indexOf('metadata-based-feedback') > -1
        <MetadataBasedFeedback
          subject={@props.subject}
          classification={@props.classification}
          dudLabel='DUD'
          simLabel='SIM'
          subjectLabel='SUB'
          metaTypeFieldName='#Type'
          metaSuccessMessageFieldName='#F_Success'
          metaFailureMessageFieldName='#F_Fail'
          metaSimCoordXPattern='#X'
          metaSimCoordYPattern='#Y'
          metaSimTolPattern='#Tol'
        />}

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
        <ClassificationSummary
          workflow={@props.workflow}
          classification={classification}
          classificationCount={@state.classificationCount}
          splits={@props.splits}
        />
      </div>

      <hr />

      <nav className="task-nav">
        {if @props.owner? and @props.project? and !disableTalk
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
    disableTalk = @props.classification.metadata.subject_flagged?

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
        {if @props.owner? and @props.project? and !disableTalk
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
      cachedAnnotation = CacheClassification.isAnnotationCached(taskKey)
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
      CacheClassification.update(lastAnnotation)

  completeClassification: ->
    if @props.workflow.configuration.persist_annotations
      CacheClassification.delete()

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

    if currentAnnotation.shortcut
      @addAnnotationForTask @props.classification, currentTask.unlinkedTask
      newAnnotation = classification.annotations[classification.annotations.length - 1]
      newAnnotation['value'] = currentAnnotation.shortcut['index']
      delete currentAnnotation['shortcut']
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
