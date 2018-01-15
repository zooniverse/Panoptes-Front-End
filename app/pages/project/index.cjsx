React = require 'react'
createReactClass = require 'create-react-class'
{ Helmet } = require 'react-helmet'
apiClient = require 'panoptes-client/lib/api-client'
{ Split } = require('seven-ten')
counterpart = require 'counterpart'
ProjectTranslations = require('./project-translations').default
{ connect } = require 'react-redux';
{ bindActionCreators } = require 'redux';
translationActions  = require '../../redux/ducks/translations';
ProjectPage = require('./project-page').default;
WorkflowSelection = require('./workflow-selection').default;

counterpart.registerTranslations 'en', require('../../locales/en').default
counterpart.registerTranslations 'it', require('../../locales/it').default
counterpart.registerTranslations 'es', require('../../locales/es').default
counterpart.registerTranslations 'nl', require('../../locales/nl').default
counterpart.setFallbackLocale 'en'


ProjectPageController = createReactClass
  displayName: 'ProjectPageController'

  contextTypes:
    geordi: React.PropTypes.object
    initialLoadComplete: React.PropTypes.bool
    router: React.PropTypes.object.isRequired

  propTypes:
    params: React.PropTypes.object
    user: React.PropTypes.object

  getDefaultProps: ->
    params: {}
    user: null

  getInitialState: ->
    background: null
    error: null
    guide: null
    guideIcons: {}
    loading: false
    organization: null
    owner: null
    preferences: null
    project: null
    projectAvatar: null
    projectIsComplete: false
    projectRoles: null
    splits: null

  _listenedToPreferences: null

  _boundForceUpdate: null

  componentWillMount: ->
    { actions } = @props
    actions.translations.setLocale(@props.location.query.language) if @props.location.query.language

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
      @setState { splits: null }
      @context.geordi?.forget ['experiment','cohort']

  fetchProjectData: (ownerName, projectName, user) ->
    @setState({
      error: null,
      loading: true,
      preferences: null,
    })

    slug = ownerName + '/' + projectName

    apiClient.type('projects').get({ slug, include: 'avatar,background,owners' })
      .then ([project]) =>
        @setState {project}

        if project?
          # Use apiClient with cached resources from include to get out of cache
          awaitBackground = apiClient.type('backgrounds').get(project.links.background.id)
          .catch((error) =>
            if error.status is 404 then { src: '' } else console.error(error)
          )

          if project.links?.organization?
            awaitOrganization = project.get('organization', { listed: true })
              .catch((error) => [])
              .then((response) => if response?.display_name then response else null)
          else
            awaitOrganization = Promise.resolve(null)

          awaitOwner = apiClient.type('users').get(project.links.owner.id).catch((error) => console.error(error))

          awaitPages = project.get('pages').catch((error) => []) # does not appear in project links?

          awaitProjectAvatar = apiClient.type('avatars').get(project.links.avatar.id).catch((error) => null)

          awaitProjectCompleteness = Promise.resolve(project.completeness is 1.0)

          awaitProjectRoles = project.get('project_roles', { page_size: 50 }).catch((error) => console.error(error))

          awaitPreferences = @getUserProjectPreferences(project, user)

          Promise.all([
            awaitBackground,
            awaitOrganization,
            awaitOwner,
            awaitPages,
            awaitProjectAvatar,
            awaitProjectCompleteness,
            awaitProjectRoles,
            awaitPreferences,
            this.props.actions.translations.load('project', project.id, this.props.translations.locale)
          ]).then(([background, organization, owner, pages, projectAvatar, projectIsComplete, projectRoles, preferences]) =>
              @setState({ background, organization, owner, pages, projectAvatar, projectIsComplete, projectRoles, preferences })
              @loadFieldGuide(project.id)
              this.props.actions.translations.loadTranslations('project_page', pages.map((page) => page.id), this.props.translations.locale)
            ).catch((error) => @setState({ error }); console.error(error); );

        else
          @setState
            background: null
            error: new Error 'NOT_FOUND'
            organization: null
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
          }).save().catch (error) =>
            console.warn error.message
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
      .catch (error) =>
        console.warn error.message

  listenToPreferences: (preferences) ->
    @_listenedToPreferences?.stopListening 'change', @_boundForceUpdate
    preferences?.listen 'change', @_boundForceUpdate
    @_listenedToPreferences = preferences

  loadFieldGuide: (projectId) ->
    apiClient.type('field_guides').get(project_id: projectId).then ([guide]) =>
      { actions, translations } = this.props;
      @setState {guide}
      actions.translations.load('field_guide', guide?.id, translations.locale)
      guide?.get('attached_images', page_size: 100)?.then (images) =>
        guideIcons = {}
        for image in images
          guideIcons[image.id] = image
        @setState {guideIcons}

  handlePreferencesChange: (key, value) ->
    changes = {};
    changes[key] = value;
    { preferences } = @state
    if preferences?
      preferences.update(changes)
      @setState { preferences }
      if this.props.user?
        preferences.save()

  render: ->
    slug = @props.params.owner + '/' + @props.params.name
    betaApproved = @state.project?.beta_approved

    <div className="project-page-wrapper">
      <Helmet title="#{@state.project?.display_name ? counterpart 'loading'}" />
      {if betaApproved
        <div className="beta-border"></div>}

      {if @state.project? and @state.owner?
        <ProjectTranslations
          project={@state.project}
        >
          <WorkflowSelection
            actions={@props.actions}
            location={@props.location}
            preferences={@state.preferences}
            project={@state.project}
            projectRoles={@state.projectRoles}
            translations={@props.translations}
            user={@props.user}
            onChangePreferences={@handlePreferencesChange}
          >
            <ProjectPage
              {...@props}
              background={@state.background}
              guide={@state.guide}
              guideIcons={@state.guideIcons}
              loading={@state.loading}
              onChangePreferences={@handlePreferencesChange}
              organization={@state.organization}
              owner={@state.owner}
              pages={@state.pages}
              preferences={@state.preferences}
              project={@state.project}
              projectAvatar={@state.projectAvatar}
              projectIsComplete={@state.projectIsComplete}
              projectRoles={@state.projectRoles}
              splits={@state.splits}
            />
          </WorkflowSelection>
        </ProjectTranslations>

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

mapStateToProps = (state) -> ({
  translations: state.translations
});

mapDispatchToProps = (dispatch) -> ({
  actions: {
    translations: bindActionCreators(translationActions, dispatch)
  }
});

module.exports = {
    default: connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ProjectPageController)
    ProjectPageController
  }
