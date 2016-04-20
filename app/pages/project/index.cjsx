counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{IndexLink, Link} = require 'react-router'
{Markdown} = require 'markdownz'
PotentialFieldGuide = require './potential-field-guide'
TitleMixin = require '../../lib/title-mixin'
apiClient = require 'panoptes-client/lib/api-client'
{sugarClient} = require 'panoptes-client/lib/sugar'

counterpart.registerTranslations 'en',
  project:
    loading: 'Loading project'
    disclaimer: "This project has been built using the Zooniverse Project Builder but is not yet an official Zooniverse project. Queries and issues relating to this project directed at the Zooniverse Team may not receive any response."
    nav:
      about: 'About'
      classify: 'Classify'
      talk: 'Talk'

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
  getDefaultProps: ->
    project: null
    owner: null

  getInitialState: ->
    background: null
    avatar: null
    pages: []

  componentDidMount: ->
    document.documentElement.classList.add 'on-project-page'
    @fetchInfo @props.project
    @updateSugarSubscription @props.project

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-project-page'
    @updateSugarSubscription null

  componentWillReceiveProps: (nextProps) ->
    if nextProps.project isnt @props.project
      @fetchInfo nextProps.project
      @updateSugarSubscription nextProps.project

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

    <div className="project-page">
      {if @state.background?
        <div className="project-background" style={backgroundImage: "url('#{@state.background.src}')"}></div>}

      <nav className="project-nav tabbed-content-tabs">
        {if @props.project.redirect
          <a href={@props.project.redirect} className="tabbed-content-tab" target="_blank">
            {if @state.avatar?
              <img src={@state.avatar.src} className="avatar" />}
            Visit {@props.project.display_name}
          </a>
        else
          <IndexLink to="#{projectPath}" activeClassName="active" className="tabbed-content-tab">
            {if @state.avatar?
              <img src={@state.avatar.src} className="avatar" />}
            {@props.project.display_name}
          </IndexLink>}

        {unless @props.project.redirect
          <Link to="#{projectPath}/about" activeClassName="active" className="tabbed-content-tab">
            <Translate content="project.nav.about" />
          </Link>}

        {if @props.project.redirect
          <a href={@redirectClassifyLink(@props.project.redirect)} className="tabbed-content-tab" target="_blank">
            <Translate content="project.nav.classify" />
          </a>
        else
          <Link to="#{projectPath}/classify" activeClassName="active" className="classify tabbed-content-tab">
            <Translate content="project.nav.classify" />
          </Link>}

        <Link to="#{projectPath}/talk" activeClassName="active" className="tabbed-content-tab">
          <Translate content="project.nav.talk" />
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

      {React.cloneElement @props.children, user: @props.user, project: @props.project, owner: @props.owner}

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

  componentDidMount: ->
    @fetchProject @props.params.owner, @props.params.name

  componentWillReceiveProps: (nextProps) ->
    {owner, name} = nextProps.params
    pathChanged = owner isnt @props.params.owner or name isnt @props.params.name
    userChanged = nextProps.user isnt @props.user

    if pathChanged or userChanged
      @fetchProject owner, name

  fetchProject: (owner, name) ->
    @setState
      loading: true
      error: null
      project: null
      owner: null

    query = slug: owner + '/' + name

    apiClient.type('projects').get query
      .then ([project]) =>
        @setState {project}
        project.get 'owner'
      .then (owner) =>
        @setState {owner}
      .catch (error) =>
        @setState {error}
      .then =>
        @setState loading: false

  render: ->
    slug = @props.params.owner + '/' + @props.params.name

    <div className="project-page-wrapper">
      {if @state.loading
        <div>
          <p>
            Loading{' '}
            <strong>{slug}</strong>...
          </p>
        </div>}

      {if @state.error?
        <div>
          <p>
            There was an error retrieving the project{' '}
            <strong>{slug}</strong>.
          </p>
          <p>
            <code>{@state.error.stack}</code>
          </p>
        </div>}

      {if @state.project? and @state.owner?
        <ProjectPage {...@props} project={@state.project} owner={@state.owner} />}
    </div>

module.exports = ProjectPageController
