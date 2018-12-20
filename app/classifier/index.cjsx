React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
apiClient = require 'panoptes-client/lib/api-client'
Classifier = require('./classifier').default
MiniCourse = require './mini-course'
Tutorial = require('./tutorial').default
CustomSignInPrompt = require('./custom-sign-in-prompt').default;
isAdmin = require '../lib/is-admin'
{ VisibilitySplit } = require 'seven-ten'
{ connect } = require 'react-redux';
{ bindActionCreators } = require 'redux';
translationActions  = require '../redux/ducks/translations';

###############################################################################
# Page Wrapper Component
###############################################################################
auth = require 'panoptes-client/lib/auth'

# Classification count tracked for mini-course prompt
classificationsThisSession = 0

auth.listen ->
  classificationsThisSession = 0

PROMPT_MINI_COURSE_EVERY = 5

RELOAD_UPP_EVERY = 5

ClassifierWrapper = createReactClass
  displayName: 'ClassifierWrapper'

  contextTypes:
    geordi: PropTypes.object
    store: PropTypes.object

  propTypes:
    classification: PropTypes.object
    onLoad: PropTypes.func
    onComplete: PropTypes.func
    onClickNext: PropTypes.func
    translations: PropTypes.shape({
        locale: PropTypes.string
      })
    workflow: PropTypes.object
    user: PropTypes.object

  getDefaultProps: ->
    classification: {}
    onLoad: Function.prototype
    onComplete: Function.prototype
    onClickNext: Function.prototype
    subject: null,
    translations: {
      locale: 'en'
    }
    workflow: null
    user: null

  getInitialState: ->
    expertClassifier: null
    userRoles: []
    tutorial: null
    minicourse: null
    classificationCount: null

  componentDidMount: ->
    @checkExpertClassifier()
    @loadClassificationsCount @props.subject

    Tutorial.find @props.workflow
    .then (tutorial) =>
      {user, preferences} = @props
      @setState {tutorial}
      this.props.actions.translations.load('tutorial', tutorial.id, this.props.translations.locale) if tutorial?
    MiniCourse.find @props.workflow
    .then (minicourse) =>
      @setState {minicourse}
      this.props.actions.translations.load('tutorial', minicourse.id, this.props.translations.locale) if minicourse?

  componentDidUpdate: (prevProps, prevState) ->
    { tutorial, minicourse } = @state
    if prevProps.translations.locale isnt this.props.translations.locale
      this.props.actions.translations.load('tutorial', tutorial.id, this.props.translations.locale) if tutorial?
      this.props.actions.translations.load('tutorial', minicourse.id, this.props.translations.locale) if minicourse?

    if prevProps.workflow isnt @props.workflow
      Tutorial.find @props.workflow
      .then (tutorial) =>
        {user, preferences} = @props
        @setState {tutorial}
        this.props.actions.translations.load('tutorial', tutorial.id, this.props.translations.locale) if tutorial?
      MiniCourse.find @props.workflow
      .then (minicourse) =>
        @setState {minicourse}
        this.props.actions.translations.load('minicourse', minicourse.id, this.props.translations.locale) if minicourse?
    
    if tutorial isnt prevState.tutorial
      Tutorial.startIfNecessary tutorial, @props.user, @props.preferences, @context.geordi, @context.store

    if @props.user isnt prevProps.user
      @setState expertClassifier: null
      @checkExpertClassifier @props

    unless prevProps.classification is @props.classification
      @loadClassificationsCount @props.subject

  onComplete: ->
    classificationsThisSession += 1
    @maybeLaunchMiniCourse()
    @maybeRequestUserProjectPreferences()
    @props.onComplete?()

  maybeRequestUserProjectPreferences: ->
    if classificationsThisSession % RELOAD_UPP_EVERY is 0 and @props.project?.experimental_tools.includes('workflow assignment')
      @props.requestUserProjectPreferences(@props.project, @props.user)

  maybeLaunchMiniCourse: ->
    shouldPrompt = classificationsThisSession % PROMPT_MINI_COURSE_EVERY is 0
    split = @props.splits?['mini-course.visible']
    isntHidden = not split or split?.variant?.value?.auto
    if shouldPrompt and isntHidden
      MiniCourse.startIfNecessary @state.minicourse, @props.preferences, @props.user, @context.geordi, @context.store

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

  loadClassificationsCount: (subject) ->
    query = {};
    # Split 'subject.first-to-classify.visible' is a visibility split on 
    # a generic pre-classification notification banner on the classify page.
    # Split 'subject.first-to-classify' is a text split in the classification summary.
    # Projects need classification summarys visible for this to work.
    if @props.splits and subject and (@props.splits['subject.first-to-classify.visible'] or @props.splits['subject.first-to-classify'])
      query =
        workflow_id: @props.workflow.id,
        subject_id: subject.id

      apiClient.type('subject_workflow_statuses')
      .get(query)
      .then ([sws]) =>
        classificationCount = if sws?.classifications_count then sws.classifications_count else 0
        @setState({ classificationCount });

        if classificationCount is 0 and @props.splits?['subject.first-to-classify.visible']
          @context.geordi.logEvent({
            type: 'first to classify banner shown'
            data: { workflowId: @props.workflow.id }
          })

  render: ->
    <div className="content-container">
      {if @props.project.experimental_tools.indexOf('workflow assignment') > -1 and @props.project.id is '1104' and not @props.user # Gravity Spy
        <CustomSignInPrompt classificationsThisSession={classificationsThisSession}>
          <p>Please sign in or sign up to access more glitch types and classification options as well as our mini-course.</p>
        </CustomSignInPrompt>}

      {if @state.classificationCount is 0 and @props.splits?['subject.first-to-classify.visible']
        <VisibilitySplit splits={@props.splits} splitKey={'subject.first-to-classify.visible'} elementKey={'div'}>
          <div className="classifier-announcement-banner classifier-announcement-banner--yellow">
            <p>You're the first person to classify this subject!</p>
          </div>
        </VisibilitySplit>}

      {if @props.workflow? and @props.subject?
        <Classifier {...@props}
          workflow={@props.workflow}
          subject={@props.subject}
          expertClassifier={@state.expertClassifier}
          userRoles={@state.userRoles}
          tutorial={@state.tutorial}
          minicourse={@state.minicourse}
          guide={@state.guide}
          guideIcons={@state.guideIcons}
          onComplete={@onComplete}
          classificationCount={@state.classificationCount}
        >
          {@props.children}
        </Classifier>
      else
        <span>Loading classifier...</span>}
    </div>

mapStateToProps = (state) -> ({
  translations: state.translations
});

mapDispatchToProps = (dispatch) -> ({
  actions: {
    translations: bindActionCreators(translationActions, dispatch)
  }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(ClassifierWrapper)
module.exports.ClassifierWrapper = ClassifierWrapper
