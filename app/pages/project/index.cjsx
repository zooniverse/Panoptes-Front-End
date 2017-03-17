React = require 'react'
TitleMixin = require '../../lib/title-mixin'
apiClient = require 'panoptes-client/lib/api-client'
{ Split } = require('seven-ten')
isAdmin = require '../../lib/is-admin'
ProjectPage = require './project-page'

ProjectPageController = React.createClass
  displayName: 'ProjectPageController'

  mixins: [TitleMixin]

  contextTypes:
    geordi: React.PropTypes.object
    initialLoadComplete: React.PropTypes.bool

  propTypes:
    params: React.PropTypes.object
    user: React.PropTypes.object

  title: ->
    @state.project?.display_name ? '(Loading)'

  getDefaultProps: ->
    params: {}
    user: null

  getInitialState: ->
    background: null
    error: null
    loading: false
    loadingSelectedWorkflow: false
    owner: null
    preferences: null
    project: null
    projectAvatar: null
    projectIsComplete: false
    projectRoles: null
    splits: null
    workflow: null

  _listenedToPreferences: null

  _boundForceUpdate: null

  componentDidMount: ->
    @_boundForceUpdate = @forceUpdate.bind this
    @fetchProjectData @props.params.owner, @props.params.name, @props.user if @context.initialLoadComplete
    @setupSplits()

  componentWillReceiveProps: (nextProps, nextContext) ->
    {owner, name} = nextProps.params
    pathChanged = owner isnt @props.params.owner or name isnt @props.params.name
    userChanged = nextContext.initialLoadComplete and nextProps.user isnt @props.user

    # Wait until we know if there's a user
    if pathChanged or userChanged or nextContext.initialLoadComplete and @state.project is null
      @fetchProjectData owner, name, nextProps.user unless @state.loading
      @setupSplits nextProps

  componentWillUpdate: (nextProps, nextState) ->
    if nextState.project? and nextState.preferences? and nextProps.location.query?.workflow? and @canFetchWorkflowByQuery(nextState.project, nextProps.user)
      @getSelectedWorkflow(nextState.project, nextState.preferences) unless nextState.loadingSelectedWorkflow

    if nextState.preferences?.preferences?.selected_workflow? and @state.workflow?
      if nextState.preferences?.preferences.selected_workflow isnt @state.workflow.id
        @getSelectedWorkflow(nextState.project, nextState.preferences) unless nextState.loadingSelectedWorkflow

  componentWillUnmount: ->
    Split.clear()

  setupSplits: (props = @props) ->
    user = props.user
    {owner, name} = props.params

    if user
      Split.load("#{owner}/#{name}").then (splits) =>
        @setState {splits}
        return unless splits
        for split of splits
          continue unless splits[split].state == 'active'
          @context.geordi?.remember experiment: splits[split].name
          @context.geordi?.remember cohort: splits[split].variant?.name
          break
    else
      Split.clear()
      @context.geordi?.forget ['experiment','cohort']

  fetchProjectData: (ownerName, projectName, user) ->
    @setState({ 
      error: null,
      loading: true,
      preferences: null,
    })

    slug = ownerName + '/' + projectName

    apiClient.type('projects').get({ slug, include: 'avatar,background,owners,project_roles' })
      .then ([project]) =>
        @setState {project}

        if project?
          # Use apiClient with cached resources from include to get out of cache
          awaitBackground = apiClient.type('backgrounds').get(project.links.background.id).catch((error) => [])

          awaitOwner = apiClient.type('users').get(project.links.owner.id).catch((error) => console.error(error))

          awaitPages = project.get('pages').catch((error) => []) # does not appear in project links?

          awaitProjectAvatar = apiClient.type('avatars').get(project.links.avatar.id).catch((error) => [])

          awaitProjectCompleteness = Promise.resolve(project.completeness > 0.99)

          awaitProjectRoles = apiClient.type('project_roles').get(project.links.project_roles).catch((error) => console.error(error))

          awaitPreferences = @getUserProjectPreferences(project, user)

          Promise.all([
            awaitBackground,
            awaitOwner,
            awaitPages,
            awaitProjectAvatar,
            awaitProjectCompleteness,
            awaitProjectRoles,
            awaitPreferences
          ]).then(([background, owner, pages, projectAvatar, projectIsComplete, projectRoles, preferences]) => 
              @setState({ background, owner, pages, projectAvatar, projectIsComplete, projectRoles, preferences })
              @getSelectedWorkflow(project, preferences)
            ).catch((error) => @setState({ error }); console.error(error); );

        else
          @setState
            background: null
            error: new Error 'NOT_FOUND'
            owner: null
            pages: null
            preferences: null
            projectAvatar: null
            projectIsComplete: false
            projectRoles: null
            workflow: null

      .catch (error) =>
        @setState {error}

      .then =>
        @setState loading: false

  canFetchWorkflowByQuery: (project, user) ->
    if project?
      'allow workflow query' in project.experimental_tools or @checkUserRoles(project, user)

  getUserProjectPreferences: (project, user) ->
    @listenToPreferences null

    userPreferences = if user?
      user.get 'project_preferences', project_id: project.id
        .then ([preferences]) =>
          preferences ? newPreferences = apiClient.type('project_preferences').create({
            links: {
              project: project.id
            },
            preferences: {}
          }).save()
    else
      Promise.resolve apiClient.type('project_preferences').create
        id: 'GUEST_PREFERENCES_DO_NOT_SAVE'
        links:
          project: project.id
        preferences: {}

    userPreferences
      .then((preferences) =>
        @listenToPreferences preferences
      )

  getSelectedWorkflow: (project, preferences) ->
    @setState({ loadingSelectedWorkflow: true })
    # preference workflow query, then user selected workflow, then project owner set workflow, then default workflow
    # if none of those are set, select random workflow
    if @props.location.query?.workflow? and @canFetchWorkflowByQuery(project, @props.user)
      selectedWorkflowID = @props.location.query.workflow
      unless preferences?.preferences.selected_workflow is selectedWorkflowID
        @handlePreferencesChange('preferences.selected_workflow', selectedWorkflowID) if preferences
    else if preferences?.preferences.selected_workflow?
      selectedWorkflowID = preferences?.preferences.selected_workflow
    else if preferences?.settings?.workflow_id?
      selectedWorkflowID = preferences?.settings.workflow_id
    else if project.configuration?.default_workflow?
      selectedWorkflowID = project.configuration?.default_workflow
    else
      selectedWorkflowID = @selectRandomWorkflow(project)

    @getWorkflow(selectedWorkflowID)

  selectRandomWorkflow: (project) ->
    linkedWorkflows = project.links.workflows
    if linkedWorkflows.length is 0
      throw new Error "No workflows for project #{project.id}"
      project.uncacheLink 'workflows'
    else
      randomIndex = Math.floor Math.random() * linkedWorkflows.length
      # console.log 'Chose random workflow', linkedWorkflows[randomIndex]
      linkedWorkflows[randomIndex]

  getWorkflow: (selectedWorkflowID) ->
    apiClient.type('workflows').get({ active: true, id: "#{selectedWorkflowID}", project_id: @state.project.id })
      .catch (error) =>
        console.error error
        # TODO: Handle 404 once json-api-client error handling is fixed.
        @setState({ error: error, loadingSelectedWorkflow: false })
      .then ([workflow]) =>
        if workflow
          @setState({ loadingSelectedWorkflow: false, workflow })
        else
          console.log "No workflow #{selectedWorkflowID} for project #{@state.project.id}"
          @clearInactiveWorkflow(selectedWorkflowID)
            .then(@getSelectedWorkflow(@state.project, @state.preferences))

  clearInactiveWorkflow: (selectedWorkflowID) ->
    preferences = @state.preferences
    selectedWorkflow = preferences.preferences.selected_workflow
    projectSetWorkflow = preferences.settings?.workflow_id

    if selectedWorkflowID is preferences.preferences.selected_workflow
      preferences.update 'preferences.selected_workflow': undefined
      preferences.save()
    else if selectedWorkflowID is preferences.settings?.workflow_id
      preferences.update 'settings.workflow_id': undefined
      preferences.save()
    else
      Promise.resolve(null)

  checkUserRoles: (project, user) ->
    currentUserRoleSets = @state.projectRoles.filter((roleSet) => roleSet.links.owner.id is user.id)
    roles = currentUserRoleSets[0].roles

    isAdmin() or 'owner' in roles or 'collaborator' in roles

  listenToPreferences: (preferences) ->
    @_listenedToPreferences?.stopListening 'change', @_boundForceUpdate
    preferences?.listen 'change', @_boundForceUpdate
    @_listenedToPreferences = preferences

  handlePreferencesChange: (key, value) ->
    changes = {}
    changes[key] = value
    @state.preferences.update changes
    if @props.user?
      @state.preferences.save()

  render: ->
    slug = @props.params.owner + '/' + @props.params.name
    betaApproved = @state.project?.beta_approved

    <div className="project-page-wrapper">

      {if betaApproved
        <div className="beta-border"></div>}

      {if @state.project? and @state.owner?
        <ProjectPage
          {...@props}
          background={@state.background}
          loading={@state.loading}
          loadingSelectedWorkflow={@state.loadingSelectedWorkflow}
          onChangePreferences={@handlePreferencesChange}
          owner={@state.owner}
          pages={@state.pages}
          preferences={@state.preferences}
          project={@state.project}
          projectAvatar={@state.projectAvatar}
          projectIsComplete={@state.projectIsComplete}
          splits={@state.splits}
          workflow={@state.workflow}
        />

      else if @state.loading
        <div className="content-container">
          <p>
            Loading{' '}
            <strong>{slug}</strong>...
          </p>
        </div>

      else if @state.error?
        if @state.error.message is 'NOT_FOUND'
          <div className="content-container">
            <p>Project <code>{slug}</code> not found.</p>
            <p>If you're sure the URL is correct, you might not have permission to view this project.</p>
          </div>
        else
          <div className="content-container">
            <p>
              There was an error retrieving project{' '}
              <strong>{slug}</strong>.
            </p>
            <p>
              <code>{@state.error.toString()}</code>
            </p>
          </div>}
    </div>

module.exports = ProjectPageController
