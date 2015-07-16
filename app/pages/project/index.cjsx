counterpart = require 'counterpart'
React = require 'react'
ChangeListener = require '../../components/change-listener'
PromiseRenderer = require '../../components/promise-renderer'
Translate = require 'react-translate-component'
{Link, RouteHandler} = require 'react-router'
TitleMixin = require '../../lib/title-mixin'
HandlePropChanges = require '../../lib/handle-prop-changes'
apiClient = window.api = require '../../api/client'
require '../../api/sugar'
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
      research: 'Research'
      results: 'Results'
      classify: 'Classify'
      faq: 'FAQ'
      education: 'Education'
      talk: 'Talk'

ProjectPage = React.createClass
  displayName: 'ProjectPage'

  getDefaultProps: ->
    project: null

  componentDidMount: ->
    sugarClient.subscribeTo "project-#{ @props.project.id }"
    document.documentElement.classList.add 'on-project-page'

  componentWillUnmount: ->
    sugarClient.unsubscribeFrom "project-#{ @props.project.id }"
    document.documentElement.classList.remove 'on-project-page'

  render: ->
    <ChangeListener target={@props.project}>{=>
      <PromiseRenderer promise={@props.project.get 'owner'}>{(owner) =>
        params =
          owner: owner.login
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
            <Link to="project-research" params={params} className="tabbed-content-tab">
              <Translate content="project.nav.research" />
            </Link>
            <PromiseRenderer promise={@props.project.get 'pages'}>{(pages) =>
              pageTitles = pages.filter((page) -> page.content isnt '' and page.content?).reduce(((accum, page) -> accum[page.url_key] = page.title; accum), {})
              <span>
                {if pageTitles.result
                  <Link to="project-results" params={params} className="tabbed-content-tab">
                    {pageTitles.result}
                  </Link>}
                {if @props.project.redirect
                  <a href={@props.project.redirect} className="tabbed-content-tab">Visit project</a>
                else
                  <Link to="project-classify" params={params} className="classify tabbed-content-tab">
                    <Translate content="project.nav.classify" />
                  </Link>}
                {if pageTitles.faq
                  <Link to="project-faq" params={params} className="tabbed-content-tab">
                    {pageTitles.faq}
                  </Link>}
                {if pageTitles.education
                  <Link to="project-education" params={params} className="tabbed-content-tab">
                    {pageTitles.education}
                  </Link>}
              </span>
            }</PromiseRenderer>
            <Link to="project-talk" params={params} className="tabbed-content-tab">
              <Translate content="project.nav.talk" />
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
  mixins: [TitleMixin, HandlePropChanges]

  title: ->
    @state.project?.display_name ? '(Loading)'

  getDefaultProps: ->
    params: null
    user: null

  getInitialState: ->
    project: null

  propChangeHandlers:
    'params.owner': 'fetchProject'
    'params.name': 'fetchProject'
    'user': 'fetchProject'

  fetchProject: (_, props = @props) ->
    @setState error: false
    query =
      owner: props.params.owner
      slug: props.params.name

    apiClient.type('projects').get query
      .then ([project]) =>
        @setState { project }
      .catch =>
        @setState error: true

  render: ->
    <div className="project-page-wrapper">
      {if @state.error
        <p>There was an error retrieving the project.</p>}

      {if @state.project? && !@state.error
        <ProjectPage {...@props} project={@state.project} />}
    </div>
