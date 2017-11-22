React = require 'react'
Translate = require 'react-translate-component'
{IndexLink, Link} = require 'react-router'
{Markdown} = require 'markdownz'
{sugarClient} = require 'panoptes-client/lib/sugar'
PotentialFieldGuide = require './potential-field-guide'
`import ProjectNavbar from './project-navbar';`

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
    document.documentElement.classList.add 'on-project-page'
    @updateSugarSubscription @props.project
    @context.geordi?.remember projectToken: @props.project?.slug

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-project-page'
    @updateSugarSubscription null
    @context.geordi?.forget ['projectToken']

  componentWillReceiveProps: (nextProps, nextContext) ->
    if nextProps.project isnt @props.project
      @updateSugarSubscription nextProps.project
      @context.geordi?.remember projectToken: nextProps.project?.slug

  _lastSugarSubscribedID: null

  updateSugarSubscription: (project) ->
    if @_lastSugarSubscribedID?
      sugarClient.unsubscribeFrom "project-#{@_lastSugarSubscribedID}"
    if project?
      sugarClient.subscribeTo "project-#{project.id}"

  render: ->
    projectPath = "/projects/#{@props.project.slug}"
    onHomePage = @props.routes[2].path is undefined

    pages = [{}, @props.pages...].reduce (map, page) =>
      map[page.url_key] = page
      map

    if @props.background?
      backgroundStyle = backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url('#{@props.background.src}')"

    <div className="project-page project-background" style={backgroundStyle}>
      {if !onHomePage
        <ProjectNavbar {...@props} />}

      {if !!@props.project.configuration?.announcement
        <div className="informational project-announcement-banner">
          <Markdown>{@props.project.configuration.announcement}</Markdown>
        </div>}

      {React.cloneElement @props.children,
        background: @props.background
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
        translation: @props.translation
        user: @props.user
        workflow: @props.workflow}

      {unless @props.project.launch_approved
        <Translate component="p" className="project-disclaimer" content="project.disclaimer" />}
      {unless @props.location.pathname is projectPath
        <PotentialFieldGuide guide={@props.guide} guideIcons={@props.guideIcons} />}
    </div>

module.exports = ProjectPage
