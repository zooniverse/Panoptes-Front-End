counterpart = require 'counterpart'
React = require 'react'
ChangeListener = require '../../components/change-listener'
PromiseRenderer = require '../../components/promise-renderer'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
{Markdown} = require 'markdownz'
TitleMixin = require '../../lib/title-mixin'
HandlePropChanges = require '../../lib/handle-prop-changes'
apiClient = window.api = require 'panoptes-client/lib/api-client'
{sugarClient} = require 'panoptes-client/lib/sugar'
LoadingIndicator = require '../../components/loading-indicator'
PotentialFieldGuide = require './potential-field-guide'

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
    disclaimer: "This project has been built using the Zooniverse Project Builder but is not yet an official Zooniverse project. Queries and issues relating to this project directed at the Zooniverse Team may not receive any response."
    nav:
      research: 'Research'
      results: 'Results'
      classify: 'Classify'
      faq: 'FAQ'
      education: 'Education'
      talk: 'Talk'

ProjectAvatar = React.createClass
  displayName: 'ProjectAvatar'

  render: ->
    <PromiseRenderer promise={@props.project.get 'avatar'} then={(avatar) =>
      <img src={avatar.src} className="avatar" />
    } catch={null} />

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

  getPageTitles: (page) ->
    page.filter((page) -> page.content isnt '' and page.content?)
      .reduce(((accum, page) -> accum[page.url_key] = page.title; accum), {})

  redirect_classify_link: (redirect) ->
    "#{redirect.replace(/\/?#?\/+$/, "")}/#/classify"

  render: ->
    <ChangeListener target={@props.project}>{=>
      <PromiseRenderer promise={@props.project.get 'owner'}>{(owner) =>
        [ownerName, name] = @props.project.slug.split('/')
        projectPath = "/projects/#{ownerName}/#{name}"

        <div className="project-page">
          <PromiseRenderer promise={@props.project.get 'background'} then={(background) =>
            <div className="project-background" style={backgroundImage: "url('#{background.src}')"}></div>
          } catch={null} />

          <nav className="project-nav tabbed-content-tabs">
            {if @props.project.redirect
              <a target="_blank" href={@props.project.redirect} className="tabbed-content-tab">
                <ProjectAvatar project={@props.project} />
                Visit {@props.project.title}
              </a>
            else
              <Link to="#{projectPath}/home" activeClassName="active" className="tabbed-content-tab">
                <ProjectAvatar project={@props.project} />
                {@props.project.display_name}
              </Link>}
            {unless @props.project.redirect
              <Link to="#{projectPath}/research" activeClassName="active" className="tabbed-content-tab">
                <Translate content="project.nav.research" />
              </Link>}
            {if @props.project.redirect
              <a target="_blank" href={@redirect_classify_link(@props.project.redirect)} className="tabbed-content-tab">
                <Translate content="project.nav.classify" />
              </a>
            else
              <Link to="#{projectPath}/classify" activeClassName="active" className="classify tabbed-content-tab">
                <Translate content="project.nav.classify" />
              </Link>}
            {unless @props.project.redirect
              <PromiseRenderer promise={@props.project.get 'pages'}>{(pages) =>
                pageTitles = @getPageTitles(pages)
                <span>
                  {if pageTitles.result
                    <Link to="#{projectPath}/results" activeClassName="active"className="tabbed-content-tab">
                      {pageTitles.result}
                    </Link>}
                  {if pageTitles.faq
                    <Link to="#{projectPath}/faq" activeClassName="active" className="tabbed-content-tab">
                      {pageTitles.faq}
                    </Link>}
                  {if pageTitles.education
                    <Link to="#{projectPath}/education" activeClassName="active" className="tabbed-content-tab">
                      {pageTitles.education}
                    </Link>}
                </span>
              }</PromiseRenderer>}
            <Link to="#{projectPath}/talk" activeClassName="active" className="tabbed-content-tab">
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

          {if @props.project.configuration?.announcement
            <div className="informational project-announcement-banner">
              <Markdown>{@props.project.configuration.announcement}</Markdown>
            </div>}

          {React.cloneElement(@props.children, {owner: owner, project: @props.project, user: @props.user})}

          {unless @props.project.launch_approved or @props.project.beta_approved
            <Translate className="project-disclaimer" content="project.disclaimer" component="p" />}

          <PotentialFieldGuide project={@props.project} />
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
      slug: props.params.owner + '/' + props.params.name

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
