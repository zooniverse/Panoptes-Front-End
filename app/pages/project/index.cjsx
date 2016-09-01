counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{IndexLink, Link} = require 'react-router'
{Markdown} = (require 'markdownz').default
PotentialFieldGuide = require './potential-field-guide'
TitleMixin = require '../../lib/title-mixin'
apiClient = require 'panoptes-client/lib/api-client'
{sugarClient} = require 'panoptes-client/lib/sugar'
classNames = require 'classnames'

counterpart.registerTranslations 'en',
  project:
    loading: 'Loading project'
    disclaimer: "This project has been built using the Zooniverse Project Builder but is not yet an official Zooniverse project. Queries and issues relating to this project directed at the Zooniverse Team may not receive any response."
    nav:
      about: 'About'
      classify: 'Classify'
      talk: 'Talk'
      collections: 'Collect'

SOCIAL_ICONS =
  'bitbucket.com/': 'bitbucket'
  'facebook.com/': 'facebook-square'
  'github.com/': 'github'
  'pinterest.com/': 'pinterest'
  'plus.google.com/': 'google-plus'
  'reddit.com/': 'reddit'
  'tumblr.com/': 'tumblr'
  'twitter.com/': 'twitter'
  'vine.com/': 'vine'
  'weibo.com/': 'weibo'
  'wordpress.com/': 'wordpress'
  'youtu.be/': 'youtube'
  'youtube.com/': 'youtube'


ProjectPage = React.createClass
  contextTypes:
    setAppHeaderVariant: React.PropTypes.func
    revealSiteHeader: React.PropTypes.func
    geordi: React.PropTypes.object

  getDefaultProps: ->
    project: null
    owner: null
    preferences: null
    loading: false

  getInitialState: ->
    background: null
    avatar: null
    pages: []
    projectIsComplete: false
    selectedWorkflow: null

  componentDidMount: ->
    @context.setAppHeaderVariant 'demoted'
    unless @props.user?
      @context.revealSiteHeader()
    document.documentElement.classList.add 'on-project-page'
    @fetchInfo @props.project
    @getSelectedWorkflow @props.project, @props.preferences
    @updateSugarSubscription @props.project
    @context.geordi?.remember projectToken: @props.project?.slug

  componentWillUnmount: ->
    @context.setAppHeaderVariant null
    document.documentElement.classList.remove 'on-project-page'
    @updateSugarSubscription null
    @context.geordi?.forget ['projectToken']

  componentWillReceiveProps: (nextProps) ->
    if nextProps.project isnt @props.project
      @fetchInfo nextProps.project
      @getSelectedWorkflow nextProps.project, nextProps.preferences
      @updateSugarSubscription nextProps.project
      @context.geordi?.remember projectToken: nextProps.project?.slug
    else if nextProps.preferences?.preferences.selected_workflow isnt @state.selectedWorkflow?.id
      @getSelectedWorkflow(nextProps.project, nextProps.preferences)

  fetchInfo: (project) ->
    @setState
      background: null
      avatar: null
      pages: []

    project.get 'background'
      .catch =>
        null
      .then (background) =>
        @setState {background}

    project.get 'avatar'
      .catch =>
        null
      .then (avatar) =>
        @setState {avatar}

    project.get 'pages'
      .catch =>
        []
      .then (pages) =>
        @setState {pages}

    @checkIfProjectIsComplete(project)

  getSelectedWorkflow: (project, preferences) ->
    @setState selectedWorkflow: 'PENDING'
    # preference user selected workflow, then project owner set workflow, then default workflow
    # if none of those are set, select random workflow
    if preferences?.preferences.selected_workflow?
      preferredWorkflowID = preferences?.preferences.selected_workflow
    else if preferences?.settings?.workflow_id
      preferredWorkflowID = preferences?.settings.workflow_id
    else if project.configuration?.default_workflow 
      preferredWorkflowID = project.configuration?.default_workflow
    else
      preferredWorkflowID = @selectRandomWorkflow project

    if preferredWorkflowID?
      @getWorkflow(project)
    else
      @setState selectedWorkflow: null

  checkIfProjectIsComplete: (project) ->
    getWorkflowsInOrder(project, {active: true, fields: 'finished_at'}).then (workflows) =>
      projectIsComplete = (true for workflow in workflows when not workflow.finished_at?).length is 0
      @setState {projectIsComplete}

  selectRandomWorkflow: (project) ->
    linkedWorkflows = project.links.workflows

    if linkedWorkflows.length is 0
      throw new Error "No workflows for project #{project.id}"
      project.uncacheLink 'workflows'
    else
      randomIndex = Math.floor Math.random() * workflows.length
      # console.log 'Chose random workflow', workflows[randomIndex].id
      linkedWorkflows[randomIndex].id

  getWorkflow: (project) ->
    project.get workflow_id: preferredWorkflowID
      .then (workflow) =>
        if workflow.active
          @setState selectedWorkflow: workflow
        else
          @setState selectedWorkflow: null

  _lastSugarSubscribedID: null

  updateSugarSubscription: (project) ->
    if @_lastSugarSubscribedID?
      sugarClient.unsubscribeFrom "project-#{@_lastSugarSubscribedID}"
    if project?
      sugarClient.subscribeTo "project-#{project.id}"

  redirectClassifyLink: (redirect) ->
    "#{redirect.replace(/\/?#?\/+$/, "")}/#/classify"

  render: ->
    projectPath = "/projects/#{@props.project.slug}"

    pages = [{}, @state.pages...].reduce (map, page) =>
      map[page.url_key] = page
      map

    logClick = @context?.geordi?.makeHandler? 'project-menu'

    collectClasses = classNames {
      "tabbed-content-tab": true
      "active": @props.project? and (@props.routes[2].path is "collections" or @props.routes[2].path is "favorites")
    }

    if @state.background?
      backgroundStyle = backgroundImage: "url('#{@state.background.src}')"

    <div className="project-page">
      <div className="project-background" style={backgroundStyle}></div>

      <nav className="project-nav tabbed-content-tabs">
        {if @props.project.redirect
          <a href={@props.project.redirect} className="tabbed-content-tab" target="_blank">
            {if @state.avatar?
              <img src={@state.avatar.src} className="avatar" />}
            Visit {@props.project.display_name}
          </a>
        else
          <IndexLink to="#{projectPath}" activeClassName="active" className="tabbed-content-tab" onClick={logClick?.bind this, 'project.nav.home'}>
            {if @state.avatar?
              <img src={@state.avatar.src} className="avatar" />}
            {if @props.loading
              'Loading...'
            else
              @props.project.display_name}
          </IndexLink>}

        {unless @props.project.redirect
          <Link to="#{projectPath}/about" activeClassName="active" className="tabbed-content-tab" onClick={logClick?.bind this, 'project.nav.about'}>
            <Translate content="project.nav.about" />
          </Link>}

        {if @props.project.redirect
          <a href={@redirectClassifyLink(@props.project.redirect)} className="tabbed-content-tab" target="_blank" onClick={logClick?.bind this, 'project.nav.classify'}>
            <Translate content="project.nav.classify" />
          </a>
        else if @state.selectedWorkflow is 'PENDING'
          <span className="classify tabbed-content-tab" title="Loading..." style={opacity: 0.5}>
            <Translate content="project.nav.classify" />
          </span>
        else
          if @state.selectedWorkflow?
            query = workflow: @state.selectedWorkflow.id
          <Link to="#{projectPath}/classify" query={query} activeClassName="active" className="classify tabbed-content-tab" onClick={logClick?.bind this, 'project.nav.classify'}>
            <Translate content="project.nav.classify" />
          </Link>}

        <Link to="#{projectPath}/talk" activeClassName="active" className="tabbed-content-tab" onClick={logClick?.bind this, 'project.nav.talk'}>
          <Translate content="project.nav.talk" />
        </Link>

         <Link to="#{projectPath}/collections" activeClassName="active" className={collectClasses}>
          <Translate content="project.nav.collections" />
        </Link>

        {@props.project.urls.map ({label, url}, i) =>
          unless !!label
            for pattern, icon of SOCIAL_ICONS
              if url.indexOf(pattern) isnt -1
                iconForLabel = icon
            iconForLabel ?= 'globe'
            label = <i className="fa fa-#{iconForLabel} fa-fw fa-2x"></i>
          <a key={i} href={url} className="tabbed-content-tab" target="#{@props.project.id}#{url}">{label}</a>}
      </nav>

      {if !!@props.project.configuration?.announcement
        <div className="informational project-announcement-banner">
          <Markdown>{@props.project.configuration.announcement}</Markdown>
        </div>}

      {React.cloneElement @props.children,
        user: @props.user
        project: @props.project
        owner: @props.owner
        preferences: @props.preferences
        onChangePreferences: @props.onChangePreferences
        selectedWorkflow: @state.selectedWorkflow
        projectIsComplete: @state.projectIsComplete}

      {unless @props.project.launch_approved or @props.project.beta_approved
        <Translate component="p" className="project-disclaimer" content="project.disclaimer" />}

      <PotentialFieldGuide project={@props.project} />
    </div>


ProjectPageController = React.createClass
  displayName: 'ProjectPageController'

  mixins: [TitleMixin]

  title: ->
    @state.project?.display_name ? '(Loading)'

  getDefaultProps: ->
    params: {}
    user: null

  getInitialState: ->
    loading: false
    error: null
    project: null
    owner: null
    preferences: null

  _listenedToPreferences: null

  _boundForceUpdate: null

  componentDidMount: ->
    @_boundForceUpdate = @forceUpdate.bind this
    @fetchProjectData @props.params.owner, @props.params.name, @props.user

  componentWillReceiveProps: (nextProps) ->
    {owner, name} = nextProps.params
    pathChanged = owner isnt @props.params.owner or name isnt @props.params.name
    userChanged = nextProps.user isnt @props.user

    if pathChanged or userChanged
      @fetchProjectData owner, name, nextProps.user

  fetchProjectData: (ownerName, projectName, user) ->
    @listenToPreferences null
    @setState
      loading: true
      error: null
      preferences: null

    slug = ownerName + '/' + projectName

    apiClient.type('projects').get {slug}
      .then ([project]) =>
        @setState {project}

        if project?
          awaitOwner = project.get 'owner'
            .then (owner) =>
              @setState {owner}

          awaitPreferences = if user?
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

          awaitPreferences = awaitPreferences.then (preferences) =>
            @listenToPreferences preferences
            @setState {preferences}

          Promise.all [awaitOwner, awaitPreferences]

        else
          this.setState
            owner: null,
            preferences: null
            error: new Error 'NOT_FOUND'

      .catch (error) =>
        @setState {error}

      .then =>
        @setState loading: false

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

    <div className="project-page-wrapper">
      {if @state.project? and @state.owner?
        <ProjectPage
          {...@props}
          project={@state.project}
          owner={@state.owner}
          preferences={@state.preferences}
          loading={@state.loading}
          onChangePreferences={@handlePreferencesChange}
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
