counterpart = require 'counterpart'
React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
Translate = require 'react-translate-component'
{Link, RouteHandler} = require 'react-router'
apiClient = window.api = require '../../api/client'
auth = require '../../api/auth'
TitleMixin = require '../../lib/title-mixin'
PromiseToSetState = require '../../lib/promise-to-set-state'
LoadingIndicator = require '../../components/loading-indicator'

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

  componentDidMount: ->
    document.documentElement.classList.add 'on-project-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-project-page'

  render: ->
    if @props.project.background_image
      backgroundStyle =
        backgroundImage = "url('#{@props.project.background_image}')"

    <div className="project-page">
      <div className="project-background" style={backgroundStyle}></div>
      <PromiseRenderer promise={@props.project.link 'owner'} then={@renderNav} />
      <RouteHandler ref="projectPageContent" project={@props.project} />
    </div>

  renderNav: (owner) ->
    params =
      owner: owner.login
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
        <button type="button" className="classification-anchor" onClick={@handleAnchorClick}>
          <i className="fa fa-anchor"></i>
        </button>
      </Link>
      <Link to="project-talk" params={params} className="tabbed-content-tab">
        <Translate content="project.nav.discuss" />
      </Link>
    </nav>

  handleAnchorClick: ->
    target = @refs.projectPageContent.getDOMNode()
    {top} = target.getBoundingClientRect()
    scrollTo 0, top - ((innerHeight - target.offsetHeight) / 2)

module.exports = React.createClass
  displayName: 'ProjectPageContainer'

  mixins: [TitleMixin, PromiseToSetState]

  title: ->
    @state.project?.display_name ? '(Loading)'

  getInitialState: ->
    project: null

  componentDidMount: ->
    @fetchProject @props.params.owner, @props.params.name

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.params.owner is @props.params.owner and nextProps.params.name is @props.params.name
      @fetchProject nextProps.params.owner, nextProps.params.name

  fetchProject: (owner, name) ->
    @promiseToSetState project: auth.checkCurrent().then ->
      apiClient.type('projects').get({owner: owner, display_name: name, include: 'owners'}).then ([project]) ->
        if project?
          project.refresh()
        else
          throw new Error "Couldn't find project #{owner}/#{name}"

  render: ->
    if @state.project?
      <ProjectPage project={@state.project} />
    else if @state.pending.project?
      <div>Loading project</div>
    else if @state.rejected.project?
      <div>{@state.rejected.project.toString()}</div>
    else
      <div className="content-container">
        {if @state.pending.project?
          <span><LoadingIndicator /> Loading project {@props.params.id}</span>
        else if @state.rejected.project?
          <code><i className="fa fa-exclamation-circle"></i> {@state.rejected.project.toString()}</code>
        else
          null}
      </div>
