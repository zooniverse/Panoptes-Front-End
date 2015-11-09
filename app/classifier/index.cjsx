React = require 'react'
apiClient = require '../api/client'
ChangeListener = require '../components/change-listener'
SubjectAnnotator = require './subject-annotator'
ClassificationSummary = require './classification-summary'
{Link} = require '@edpaget/react-router'
tasks = require './tasks'
{getSessionID} = require '../lib/session'
preloadSubject = require '../lib/preload-subject'
PromiseRenderer = require '../components/promise-renderer'
TriggeredModalForm = require 'modal-form/triggered'
TutorialButton = require './tutorial-button'
isAdmin = require '../lib/is-admin'
Tutorial = require '../lib/tutorial'

unless process.env.NODE_ENV is 'production'
  mockData = require './mock-data'

Classifier = React.createClass
  displayName: 'Classifier'

  getDefaultProps: ->
    user: null
    if mockData?
      {workflow, subject, classification} = mockData
    workflow: workflow ? null
    subject: subject ? null
    classification: classification ? null
    onLoad: Function.prototype

  getInitialState: ->
    subjectLoading: false
    expertClassification: null
    showingExpertClassification: false
    selectedExpertAnnotation: -1

  componentDidMount: ->
    @loadSubject @props.subject
    @prepareToClassify @props.classification
    Tutorial.startIfNecessary @props.user, @props.project

  componentWillReceiveProps: (nextProps) ->
    if nextProps.project isnt @props.project or nextProps.user isnt @props.users
      Tutorial.startIfNecessary nextProps.user, nextProps.project
    if nextProps.subject isnt @props.subject
      @loadSubject subject
    if nextProps.classification isnt @props.classification
      @prepareToClassify nextProps.classification

  loadSubject: (subject) ->
    @setState
      subjectLoading: true
      expertClassification: null
      showingExpertClassification: false
      selectedExpertAnnotation: -1

    @getExpertClassification @props.workflow, @props.subject

    preloadSubject subject
      .then =>
        if @props.subject is subject # The subject could have changed while we were loading.
          @setState subjectLoading: false
          @props.onLoad?()

  getExpertClassification: (workflow, subject) ->
    awaitExpertClassification = Promise.resolve do =>
      if subject is mockData?.subject
        subject.expert_classification_data
      else
        # TODO!
        # apiClient.type('classifications').get({
        #   gold_standard: true
        #   workflow_id: workflow.id
        #   subject_ids: [subject.id]
        # })
        #   .catch ->
        #     []
        #   .then ([expertClassification]) ->
        #     expertClassification
        null

    awaitExpertClassification.then (expertClassification) =>
      if @props.workflow is workflow and @props.subject is subject
        window.expertClassification = expertClassification
        @setState {expertClassification}

  prepareToClassify: (classification) ->
    classification.annotations ?= []
    if classification.annotations.length is 0
      @addAnnotationForTask classification, @props.workflow.first_task

  render: ->
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

      <div className="classifier">
        <SubjectAnnotator
          user={@props.user}
          project={@props.project}
          subject={@props.subject}
          workflow={@props.workflow}
          classification={currentClassification}
          annotation={currentAnnotation}
          onLoad={@handleSubjectImageLoad}
        />

        <div className="task-area">
          {if currentTask?
            @renderTask currentClassification, currentAnnotation, currentTask
          else # Classification is complete.
            @renderSummary currentClassification}
        </div>
      </div>
    }</ChangeListener>

  renderTask: (classification, annotation, task) ->
    TaskComponent = tasks[task.type]

    # Should we disabled the "Back" button?
    onFirstAnnotation = classification.annotations.indexOf(annotation) is 0

    # Should we disable the "Next" or "Done" buttons?
    if TaskComponent.isAnnotationComplete?
      waitingForAnswer = not TaskComponent.isAnnotationComplete task, annotation

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

    <div className="task-container" style={disabledStyle if @state.subjectLoading}>
      <TaskComponent task={task} annotation={annotation} onChange={@updateAnnotations.bind this, classification} />

      <hr />

      <nav className="task-nav">
        <TutorialButton user={@props.user} project={@props.project} />
        <button type="button" className="back minor-button" disabled={onFirstAnnotation} onClick={@destroyCurrentAnnotation}>Back</button>
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

  renderSummary: (classification) ->
    <div>
      Thanks!

      {if @state.expertClassification?
        <div className="has-expert-classification">
          Expert classification available.
          {if @state.showingExpertClassification
            <button type="button" onClick={@toggleExpertClassification.bind this, false}>Hide</button>
          else
            <button type="button" onClick={@toggleExpertClassification.bind this, true}>Show</button>}
        </div>}

      {if @state.showingExpertClassification
        'Expert classification:'
      else
        'Your classification:'}
      <ClassificationSummary workflow={@props.workflow} classification={classification} />

      <hr />

      <nav className="task-nav">
        {if @props.owner? and @props.project?
          [ownerName, name] = @props.project.slug.split('/')
          <Link onClick={@props.onClickNext} to="project-talk-subject" params={owner: ownerName, name: name, id: @props.subject.id} className="talk standard-button">Talk</Link>}
        <button type="button" className="continue major-button" onClick={@props.onClickNext}>Next</button>
        {@renderExpertOptions()}
      </nav>
    </div>

  renderExpertOptions: ->
    if @props.project?
      getUserRoles = @props.project.get 'project_roles'
        .then (projectRoles) =>
          getProjectRoleHavers = Promise.all projectRoles.map (projectRole) =>
            projectRole.get 'owner'
          getProjectRoleHavers
            .then (projectRoleHavers) =>
              (projectRoles[i].roles for user, i in projectRoleHavers when user is @props.user)
            .then (setsOfUserRoles) =>
              [[], setsOfUserRoles...].reduce (set, next) =>
                set.concat next

      <PromiseRenderer promise={getUserRoles}>{(userRoles) =>
        if isAdmin() or 'owner' in userRoles or 'collaborator' in userRoles or 'expert' in userRoles
          <TriggeredModalForm trigger={
            <i className="fa fa-cog fa-fw"></i>
          }>
            {if 'owner' in userRoles or 'expert' in userRoles
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

              {if isAdmin() or 'owner' in userRoles or 'collaborator' in userRoles
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
      }</PromiseRenderer>

  # Whenever a subject image is loaded in the annotator, record its size at that time.
  handleSubjectImageLoad: (e, frameIndex) ->
    {naturalWidth, naturalHeight, clientWidth, clientHeight} = e.target
    changes = {}
    changes["metadata.subject_dimensions.#{frameIndex}"] = {naturalWidth, naturalHeight, clientWidth, clientHeight}
    @props.classification.update changes

  # This is passed as a generic change handler to the tasks
  updateAnnotations: ->
    @props.classification.update 'annotations'

  # Next (or start):
  addAnnotationForTask: (classification, taskKey) ->
    taskDescription = @props.workflow.tasks[taskKey]
    annotation = tasks[taskDescription.type].getDefaultAnnotation()
    annotation.task = taskKey
    classification.annotations.push annotation
    classification.update 'annotations'

  # Back up:
  destroyCurrentAnnotation: ->
    @props.classification.annotations.pop()
    @props.classification.update 'annotations'

  completeClassification: ->
    @props.classification.update
      completed: true
      'metadata.session': getSessionID().id
      'metadata.finished_at': (new Date).toISOString()
      'metadata.viewport':
        width: innerWidth
        height: innerHeight
    @props.onComplete?()

  handleGoldStandardChange: (e) ->
    @props.classification.update gold_standard: e.target.checked || undefined # Delete the whole key.

  handleDemoModeChange: (e) ->
    @props.onChangeDemoMode e.target.checked

  toggleExpertClassification: (value) ->
    @setState showingExpertClassification: value

module.exports = React.createClass
  displayName: 'ClassifierWrapper'

  getDefaultProps: ->
    user: null
    classification: mockData?.classification ? {}
    onLoad: Function.prototype
    onComplete: Function.prototype
    onClickNext: Function.prototype

  getInitialState: ->
    workflow: null
    subject: null

  componentDidMount: ->
    @loadClassification @props.classification

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.classification is @props.classification
      @loadClassification nextProps.classification

  loadClassification: (classification) ->
    @setState
      workflow: null
      subject: null

    # TODO: These underscored references are temporary stopgaps.

    Promise.resolve(classification._workflow ? classification.get 'workflow').then (workflow) =>
      @setState {workflow}

    Promise.resolve(classification._subjects ? classification.get 'subjects').then ([subject]) =>
      # We'll only handle one subject per classification right now.
      # TODO: Support multi-subject classifications in the future.
      @setState {subject}

  render: ->
    if @state.workflow? and @state.subject?
      <Classifier {...@props} workflow={@state.workflow} subject={@state.subject} />
    else
      <span>Loading classifier...</span>
