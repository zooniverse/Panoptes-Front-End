counterpart = require 'counterpart'
React = require 'react'
HandlePropChanges = require '../../lib/handle-prop-changes'
PromiseToSetState = require '../../lib/promise-to-set-state'
ChangeListener = require '../../components/change-listener'
Translate = require 'react-translate-component'
{Link, RouteHandler} = require 'react-router'
apiClient = window.api = require '../../api/client'
auth = require '../../api/auth'
TitleMixin = require '../../lib/title-mixin'

counterpart.registerTranslations 'en',
  project:
    nav:
      science: 'Science'
      status: 'Status'
      team: 'Team'
      classify: 'Classify'
      discuss: 'Discuss'

ProjectPage = React.createClass
  displayName: 'ProjectPage'

  mixins: [HandlePropChanges, PromiseToSetState]

  propChangeHandlers:
    project: (project) ->
      unless @state.pending.owner?
        @promiseToSetState owner: project.link 'owner'

  getDefaultProps: ->
    project: null

  getInitialState: ->
    owner: null

  componentDidMount: ->
    document.documentElement.classList.add 'on-project-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-project-page'

  render: ->
    <ChangeListener target={@props.project}>{=>
      if @props.project.background_image
        backgroundStyle =
          backgroundImage: "url('#{@props.project.background_image}')"

      <div className="project-page">
        <div className="project-background" style={backgroundStyle}></div>

        {if @state.owner?
          params =
            owner: @state.owner.display_name
            name: @props.project.display_name

          <nav className="project-nav tabbed-content-tabs">
            <Link to="project-home" params={params} className="tabbed-content-tab">
              <img src={@props.project.avatar} className="project-avatar" />
              {@props.project.display_name}
            </Link>
            <Link to="project-science-case" params={params} className="tabbed-content-tab">
              <Translate content="project.nav.science" />
            </Link>
            <Link to="project-status" params={params} className="tabbed-content-tab">
              <Translate content="project.nav.status" />
            </Link>
            <Link to="project-team" params={params} className="tabbed-content-tab">
              <Translate content="project.nav.team" />
            </Link>
            <Link to="project-classify" params={params} className="classify tabbed-content-tab">
              <Translate content="project.nav.classify" />
            </Link>
            <Link to="project-talk" params={params} className="tabbed-content-tab">
              <Translate content="project.nav.discuss" />
            </Link>
          </nav>}

        {if @state.owner?
          <RouteHandler project={@props.project} owner={@state.owner} />}
      </div>
    }</ChangeListener>

module.exports = React.createClass
  displayName: 'ProjectPageWrapper'

  mixins: [TitleMixin, HandlePropChanges, PromiseToSetState]

  title: ->
    @state.project?.display_name ? '(Loading)'

  componentDidMount: ->
    auth.listen 'change', @fetchProject

  componentWillUnmount: ->
    auth.stopListening 'change', @fetchProject

  propChangeHandlers:
    'params.owner': 'fetchProject'
    'params.name': 'fetchProject'

  fetchProject: (_, props = @props) ->
    unless @state.pending.project?
      {owner, name} = props.params
      @promiseToSetState project: auth.checkCurrent().then =>
        apiClient.type('projects').get({owner: owner, display_name: name}).then ([project]) ->
          if project?
            project.refresh()
          else
            throw new Error "Couldn't find project #{owner}/#{name}"

  render: ->
    if @state.pending.project?
      <p>Loading project</p>
    else if @state.project?
      <ProjectPage project={@state.project} />
    else if @state.rejected.project?
      <p>{@state.rejected.project.toString()}</p>
    else
      null
