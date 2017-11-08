React = require 'react'
Translate = require 'react-translate-component'
{IndexLink, Link} = require 'react-router'
{Markdown} = require 'markdownz'
{sugarClient} = require 'panoptes-client/lib/sugar'
Thumbnail = require('../../components/thumbnail').default
classnames = require 'classnames'
PotentialFieldGuide = require './potential-field-guide'
`import SOCIAL_ICONS from '../../lib/social-icons'`

AVATAR_SIZE = 100

ProjectPage = React.createClass
  contextTypes:
    geordi: React.PropTypes.object

  propTypes:
    owner: React.PropTypes.object.isRequired
    preferences: React.PropTypes.object
    project: React.PropTypes.object.isRequired
    loading: React.PropTypes.bool

  getInitialState: ->
    backgroundHeight: null

  getDefaultProps: ->
    background: null
    guide: null
    guideIcons: null
    loading: false
    owner: {}
    preferences: null
    pages: null
    project: {}
    projectAvatar: null
    projectRoles: null
    splits: null

  componentDidMount: ->
    this.resizeBackground()
    addEventListener "resize", this.resizeBackground
    document.documentElement.classList.add 'on-project-page'
    @updateSugarSubscription @props.project
    @context.geordi?.remember projectToken: @props.project?.slug

  componentWillUnmount: ->
    removeEventListener "resize", this.resizeBackground
    document.documentElement.classList.remove 'on-project-page'
    @updateSugarSubscription null
    @context.geordi?.forget ['projectToken']

  componentWillReceiveProps: (nextProps, nextContext) ->
    if nextProps.project isnt @props.project
      @updateSugarSubscription nextProps.project
      @context.geordi?.remember projectToken: nextProps.project?.slug

  resizeBackground: ->
    finishedBannerHeight = 70
    projLanding = document.getElementById('projectLandingIntro')
    if projLanding
      sectionBottom = projLanding.getBoundingClientRect().bottom;
      sectionHeight = document.body.scrollTop + sectionBottom
      if @state.backgroundHeight isnt sectionHeight + finishedBannerHeight
        @setState backgroundHeight: sectionHeight + finishedBannerHeight

  _lastSugarSubscribedID: null

  updateSugarSubscription: (project) ->
    if @_lastSugarSubscribedID?
      sugarClient.unsubscribeFrom "project-#{@_lastSugarSubscribedID}"
    if project?
      sugarClient.subscribeTo "project-#{project.id}"

  redirectClassifyLink: (redirect) ->
    "#{redirect.replace(/\/?#?\/+$/, "")}/#/classify"

  renderProjectName: (betaApproved) ->
    if betaApproved
      <div>
        <p>Under Review</p>
        {@props.project.display_name}
      </div>
    else
      @props.project.display_name

  render: ->
    rearrangedLinks = @props.project.urls.sort (a, b) => a.path? & !b.path? ? 1 : 0
    betaApproved = @props.project.beta_approved
    projectPath = "/projects/#{@props.project.slug}"
    onHomePage = @props.routes[2].path is undefined
    avatarClasses = classnames('tabbed-content-tab', {
      'beta-approved': betaApproved
    })

    pages = [{}, @props.pages...].reduce (map, page) =>
      map[page.url_key] = page
      map

    logClick = @context?.geordi?.makeHandler? 'project-menu'

    collectClasses = classnames {
      "tabbed-content-tab": true
      "active": @props.project? and (@props.routes[2].path is "collections" or @props.routes[2].path is "favorites")
    }

    if @props.background?
      backgroundStyle = backgroundImage: "url('#{@props.background.src}')"
      if onHomePage
        backgroundStyle.height = @state.backgroundHeight
      else
        backgroundStyle.height = "auto"

    <div className="project-page">
      <div className="project-background" style={backgroundStyle}></div>

      <nav className="project-nav tabbed-content-tabs">
        {if @props.project.redirect
          <a href={@props.project.redirect} className="tabbed-content-tab" target="_blank">
            {if @props.projectAvatar?
              <Thumbnail src={@props.projectAvatar.src} className="avatar" width={AVATAR_SIZE} height={AVATAR_SIZE} />}
            Visit {@props.project.display_name}
          </a>
        else
          <IndexLink to="#{projectPath}" activeClassName="active" className={avatarClasses} onClick={logClick?.bind this, 'project.nav.home'}>
            {if @props.projectAvatar?
              <Thumbnail src={@props.projectAvatar.src} className="avatar" width={AVATAR_SIZE} height={AVATAR_SIZE} />}
            {if @props.loading
              'Loading...'
            else
              @renderProjectName(betaApproved)}
          </IndexLink>}

        <br className='responsive-break' />

        {unless @props.project.redirect
          <Link to="#{projectPath}/about" activeClassName="active" className="tabbed-content-tab" onClick={logClick?.bind this, 'project.nav.about'}>
            <Translate content="project.nav.about" />
          </Link>}

        {if @props.project.redirect
          <a href={@redirectClassifyLink(@props.project.redirect)} className="tabbed-content-tab" target="_blank" onClick={logClick?.bind this, 'project.nav.classify'}>
            <Translate content="project.nav.classify" />
          </a>
        else if @props.workflow is null
          <span className="classify tabbed-content-tab" title="Loading..." style={opacity: 0.5}>
            <Translate content="project.nav.classify" />
          </span>
        else
          <Link to="#{projectPath}/classify" activeClassName="active" className="classify tabbed-content-tab" onClick={logClick?.bind this, 'project.nav.classify'}>
            <Translate content="project.nav.classify" />
          </Link>}

        <Link to="#{projectPath}/talk" activeClassName="active" className="tabbed-content-tab" onClick={logClick?.bind this, 'project.nav.talk'}>
          <Translate content="project.nav.talk" />
        </Link>

         <Link to="#{projectPath}/collections" activeClassName="active" className={collectClasses}>
          <Translate content="project.nav.collections" />
        </Link>

        {if @props.user
           <Link to="#{projectPath}/recents" activeClassName="active" className="tabbed-content-tab">
            <Translate content="project.nav.recents" />
          </Link>
        }

        {rearrangedLinks.map ({label, url}, i) =>
          unless !!label
            for pattern, icon of SOCIAL_ICONS
              if url.indexOf(pattern) isnt -1
                iconForLabel = icon
            iconForLabel ?= 'globe'
            label = <i className="fa fa-#{iconForLabel} fa-fw fa-2x"></i>
          <a key={i} href={url} className="tabbed-content-tab #{if iconForLabel then 'social-icon' else ''}" target="#{@props.project.id}#{url}">{label}</a>}
      </nav>

      {if !!@props.project.configuration?.announcement
        <div className="informational project-announcement-banner">
          <Markdown>{@props.project.configuration.announcement}</Markdown>
        </div>}

      {React.cloneElement @props.children,
        loadingSelectedWorkflow: @props.loadingSelectedWorkflow
        onChangePreferences: @props.onChangePreferences
        owner: @props.owner
        pages: @props.pages
        preferences: @props.preferences
        project: @props.project
        projectAvatar: @props.projectAvatar
        projectIsComplete: @props.projectIsComplete
        projectRoles: @props.projectRoles
        splits: @props.splits
        user: @props.user
        workflow: @props.workflow}

      {unless @props.project.launch_approved
        <Translate component="p" className="project-disclaimer" content="project.disclaimer" />}
      {unless @props.location.pathname is projectPath
        <PotentialFieldGuide guide={@props.guide} guideIcons={@props.guideIcons} />}
    </div>

module.exports = ProjectPage
