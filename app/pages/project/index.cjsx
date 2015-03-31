counterpart = require 'counterpart'
React = require 'react'
ChangeListener = require '../../components/change-listener'
PromiseRenderer = require '../../components/promise-renderer'
Translate = require 'react-translate-component'
{Link, RouteHandler} = require 'react-router'
TitleMixin = require '../../lib/title-mixin'
HandlePropChanges = require '../../lib/handle-prop-changes'
PromiseToSetState = require '../../lib/promise-to-set-state'
auth = require '../../api/auth'
apiClient = window.api = require '../../api/client'
LoadingIndicator = require '../../components/loading-indicator'

counterpart.registerTranslations 'en',
  project:
    loading: 'Loading project'
    nav:
      science: 'Science'
      results: 'Results'
      classify: 'Classify'
      faq: 'FAQ'
      education: 'Education'
      discuss: 'Discuss'

ProjectPage = React.createClass
  displayName: 'ProjectPage'

  getDefaultProps: ->
    project: null

  componentDidMount: ->
    document.documentElement.classList.add 'on-project-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-project-page'

  render: ->
    <ChangeListener target={@props.project}>{=>
      <PromiseRenderer promise={@props.project.get 'owner'}>{(owner) =>
        if @props.project.background_image
          backgroundStyle =
            backgroundImage: "url('#{@props.project.background_image}')"

        params =
          owner: owner.display_name
          name: @props.project.display_name

        <div className="project-page">
          <div className="project-background" style={backgroundStyle}></div>

          <nav className="project-nav tabbed-content-tabs">
            <Link to="project-home" params={params} className="tabbed-content-tab">
              <img src={@props.project.avatar} className="avatar" /> {@props.project.display_name}
            </Link>
            <Link to="project-science-case" params={params} className="tabbed-content-tab">
              <Translate content="project.nav.science" />
            </Link>
            {if @props.project.result
              <Link to="project-results" params={params} className="tabbed-content-tab">
                <Translate content="project.nav.results" />
              </Link>}
            <Link to="project-classify" params={params} className="classify tabbed-content-tab">
              <Translate content="project.nav.classify" />
            </Link>
            {if @props.project.faq
              <Link to="project-faq" params={params} className="tabbed-content-tab">
                <Translate content="project.nav.faq" />
              </Link>}
            {if @props.project.education_content
              <Link to="project-education" params={params} className="tabbed-content-tab">
                <Translate content="project.nav.education" />
              </Link>}
            <Link to="project-talk" params={params} className="tabbed-content-tab">
              <Translate content="project.nav.discuss" />
            </Link>
          </nav>

          <RouteHandler {...@props} owner={owner} />
        </div>
      }</PromiseRenderer>
    }</ChangeListener>

module.exports = React.createClass
  displayName: 'ProjectPageWrapper'

  mixins: [TitleMixin, HandlePropChanges, PromiseToSetState]

  title: ->
    @state.project?.display_name ? '(Loading)'

  getDefaultProps: ->
    params: null

  getInitialState: ->
    project: null

  propChangeHandlers:
    'params.owner': 'fetchProject'
    'params.name': 'fetchProject'

  componentDidMount: ->
    auth.listen 'change', @fetchProject

  componentWillUnmount: ->
    auth.stopListening 'change', @fetchProject

  fetchProject: (_, props = @props) ->
    unless @state.pending.project?
      query =
        owner: props.params.owner
        display_name: props.params.name
      @promiseToSetState project: auth.checkCurrent().then ->
        # TODO: This refresh is a little annoying. Can get the complete resource somehow?
        apiClient.type('projects').get(query).index(0).refresh().catch ->
          throw new Error "Couldn't find project #{props.params.owner}/#{props.params.name}"

  render: ->
    if @state.project?
      <ProjectPage {...@props} project={@state.project} />
    else
      <div className="content-container">
        {if @state.rejected.project?
          <code>{@state.rejected.project.toString()}</code>
        else
          <LoadingIndicator>
            <Translate content="project.loading" />
          </LoadingIndicator>}
      </div>
