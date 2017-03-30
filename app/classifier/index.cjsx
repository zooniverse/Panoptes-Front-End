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
`import FrameAnnotator from './frame-annotator';`
`import CacheClassification from '../components/cache-classification';`
`import Task from './task';`
{ VisibilitySplit } = require('seven-ten');
`import RestartButton from './restart-button';`
MiniCourse = require '../components/mini-course'
Tutorial = require '../components/tutorial'
interventionMonitor = require '../lib/intervention-monitor'
experimentsClient = require '../lib/experiments-client'
TaskNav = require('./task-nav').default
ExpertOptions = require('./expert-options').default
`import CustomSignInPrompt from './custom-sign-in-prompt';`

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
    expertClassification: null
    selectedExpertAnnotation: -1
    showingExpertClassification: false
    subjectLoading: false
    annotations: []

  componentDidMount: ->
    @loadSubject @props.subject

  componentWillReceiveProps: (nextProps) ->
    if nextProps.user isnt @props.user
      if @props.demoMode
        @props.onChangeDemoMode false
      if @props.classification.gold_standard
        @props.classification.update gold_standard: undefined

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

  componentWillMount: () ->
    @props.classification.listen 'change', =>
      {annotations} = @props.classification
      @setState {annotations}

  componentWillUnmount: () ->
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

  render: ->
    largeFormatImage = @props.workflow.configuration.image_layout and 'no-max-height' in @props.workflow.configuration.image_layout
    classifierClassNames = if largeFormatImage then "classifier large-image" else "classifier"

    if @state.showingExpertClassification
      currentClassification = @state.expertClassification
      currentClassification.completed = true
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
        isFavorite={@props.subject.favorite}
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
        {unless currentClassification.completed
          <Task
            preferences={@props.preferences}
            user={@props.user}
            project={@props.project}
            workflow={@props.workflow}
            classification={currentClassification}
            task={currentTask}
            annotation={currentAnnotation}
            subjectLoading={@state.subjectLoading}
          />
        else
          <ClassificationSummary
            project={@props.project}
            workflow={@props.workflow}
            subject={@props.subject}
            classification={classification}
            expertClassification={@state.expertClassification}
            splits={@props.splits}
            classificationCount={@state.classificationCount}
            hasGSGoldStandard={@subjectIsGravitySpyGoldStandard()}
            toggleExpertClassification={@toggleExpertClassification}
          />
        }

        <TaskNav
          annotation={currentAnnotation}
          classification={currentClassification}
          completeClassification={@completeClassification}
          nextSubject={@props.onClickNext}
          project={@props.project}
          subject={@props.subject}
          task={currentTask}
          workflow={@props.workflow}
        >
          {if @props.expertClassifier
            <ExpertOptions
              classification={currentClassification}
              userRoles={@props.userRoles}
              demoMode={@props.demoMode}
              onChangeDemoMode={@props.onChangeDemoMode}
            />}
        </TaskNav>
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
          <p style={{ textAlign: 'center' }}>
            <i className="fa fa-trash" />{' '}
            <small>
              <strong>Demo mode:</strong>
              <br />
              No classifications are being recorded.{' '}
              <button type="button" className="secret-button" onClick={@changeDemoMode.bind(this, false)}>
                <u>Disable</u>
              </button>
            </small>
          </p>
        }
        {if currentClassification.gold_standard
          <p style={{ textAlign: 'center' }}>
            <i className="fa fa-star" />{' '}
            <small>
              <strong>Gold standard mode:</strong>
              <br />
              Please ensure this classification is completely accurate.{' '}
              <button type="button" className="secret-button" onClick={currentClassification.update.bind(currentClassification, { gold_standard: undefined })}>
                <u>Disable</u>
              </button>
            </small>
          </p>
        }
      </div>
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

  completeClassification: ->
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

  toggleExpertClassification: (value) ->
    @setState showingExpertClassification: value

  changeDemoMode: (demoMode) ->
    @props.onChangeDemoMode demoMode

  subjectIsGravitySpyGoldStandard: ->
    @props.workflow.configuration?.gravity_spy_gold_standard and @props.subject.metadata?['#Type'] is 'Gold'

###############################################################################
# Page Wrapper Component
###############################################################################
auth = require 'panoptes-client/lib/auth'

# Classification count tracked for mini-course prompt
classificationsThisSession = 0

auth.listen ->
  classificationsThisSession = 0

PROMPT_MINI_COURSE_EVERY = 5

module.exports = React.createClass
  displayName: 'ClassifierWrapper'

  contextTypes:
    geordi: React.PropTypes.object

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
    tutorial: null
    minicourse: null

  componentDidMount: ->
    @checkExpertClassifier()
    @loadClassification @props.classification
    Tutorial.find @props.workflow
    .then (tutorial) =>
      {user, preferences} = @props
      Tutorial.startIfNecessary tutorial, user, preferences, @context.geordi
      @setState {tutorial}
    MiniCourse.find @props.workflow
    .then (minicourse) =>
      @setState {minicourse}

  componentWillReceiveProps: (nextProps) ->
    if nextProps.workflow isnt @props.workflow
      Tutorial.find nextProps.workflow
      .then (tutorial) =>
        {user, preferences} = nextProps
        Tutorial.startIfNecessary tutorial, user, preferences, @context.geordi
        @setState {tutorial}
      MiniCourse.find nextProps.workflow
      .then (minicourse) =>
        @setState {minicourse}

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

  onCompleteAndLoadAnotherSubject: ->
    classificationsThisSession += 1
    @maybeLaunchMiniCourse()
    @props.onCompleteAndLoadAnotherSubject?()

  onComplete: ->
    classificationsThisSession += 1
    @maybeLaunchMiniCourse()
    @props.onComplete?()

  maybeLaunchMiniCourse: ->
    shouldPrompt = classificationsThisSession % PROMPT_MINI_COURSE_EVERY is 0
    split = @props.splits?['mini-course.visible']
    isntHidden = not split or split?.variant?.value?.auto
    if shouldPrompt and isntHidden
      MiniCourse.startIfNecessary @state.minicourse, @props.preferences, @props.user, @context.geordi

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
    <div>
      {if @props.project.experimental_tools.indexOf('workflow assignment') > -1 and not @props.user # Gravity Spy
        <CustomSignInPrompt classificationsThisSession={classificationsThisSession}>
          <p>Please sign in or sign up to access more glitch types and classification options as well as our mini-course.</p>
        </CustomSignInPrompt>}
      {if @props.workflow? and @state.subject?
        <Classifier {...@props}
          workflow={@props.workflow}
          subject={@state.subject}
          expertClassifier={@state.expertClassifier}
          userRoles={@state.userRoles}
          tutorial={@state.tutorial}
          minicourse={@state.minicourse}
          guide={@state.guide}
          guideIcons={@state.guideIcons}
          onComplete={@onComplete}
          onCompleteAndLoadAnotherSubject={@onCompleteAndLoadAnotherSubject}
        />
      else
        <span>Loading classifier...</span>}
    </div>
