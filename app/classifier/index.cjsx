React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
Classifier = require('./classifier').default
MiniCourse = require '../components/mini-course'
Tutorial = require '../components/tutorial'
`import CustomSignInPrompt from './custom-sign-in-prompt';`
isAdmin = require '../lib/is-admin'

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
