React = require 'react'
Translate = require 'react-translate-component'
{IndexLink, Link} = require 'react-router'
{Markdown} = require 'markdownz'
{sugarClient} = require 'panoptes-client/lib/sugar'
Thumbnail = require('../../components/thumbnail').default
classnames = require 'classnames'
PotentialFieldGuide = require './potential-field-guide'
`import SOCIAL_ICONS from '../../lib/social-icons'`
`import ProjectNavbar from './project-navbar'`
`import isAdmin from '../../lib/is-admin';`

AVATAR_SIZE = 100

ProjectPage = React.createClass
  childContextTypes:
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

  getChildContext: ->
    @context.geordi

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

  render: ->
    betaApproved = @props.project.beta_approved
    projectPath = "/projects/#{@props.project.slug}"
    labPath = "/lab/#{@props.project.id}"
    adminPath = "/admin/project_status/#{@props.project.slug}"
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

      <ProjectNavbar {...@props} />

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
