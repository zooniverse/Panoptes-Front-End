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
        params =
          owner: owner.slug
          name: @props.project.slug

        <div className="project-page">
          <PromiseRenderer promise={@props.project.get 'background'} then={(background) =>
            <div className="project-background" style={backgroundImage: "url('#{background.src}')"}></div>
          } catch={null} />

          <nav className="project-nav tabbed-content-tabs">
            <Link to="project-home" params={params} className="tabbed-content-tab">
              <PromiseRenderer promise={@props.project.get 'avatar'} then={(avatar) =>
                <img src={avatar.src} className="avatar" />
              } catch={null} />
              {@props.project.display_name}
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
            {for link, i in @props.project.urls
              link._key ?= Math.random()
              {label} = link
              unless label
                for pattern, icon of SOCIAL_ICONS
                  if link.url.indexOf(pattern) isnt -1
                    socialIcon = icon
                socialIcon ?= 'globe'
                label = <i className="fa fa-#{socialIcon} fa-fw fa-2x"></i>
              <a key={link._key} href={link.url} className="tabbed-content-tab" target="#{@props.project.id}-#{i}">{label}</a>}
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
        slug: props.params.name
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
