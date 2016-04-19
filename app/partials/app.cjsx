React = require 'react'
auth = require 'panoptes-client/lib/auth'
IOStatus = require './io-status'
MainHeader = require './main-header'
MainFooter = require './main-footer'
GeordiClient = require 'zooniverse-geordi-client'
{generateSessionID} = require '../lib/session'

module.exports = React.createClass
  displayName: 'PanoptesApp'

  geordi: null

  childContextTypes:
    user: React.PropTypes.object
    project: React.PropTypes.object
    subject: React.PropTypes.object
    workflow: React.PropTypes.object
    classification: React.PropTypes.object

    updateUser: React.PropTypes.func
    updateProject: React.PropTypes.func
    updateSubject: React.PropTypes.func
    updateWorkflow: React.PropTypes.func
    updateClassification: React.PropTypes.func

    geordi: React.PropTypes.object

  getChildContext: ->
    user: @state.user
    project: @state.project
    subject: @state.subject
    workflow: @state.workflow
    classification: @state.classification

    updateUser: @updateUser
    updateProject: @updateProject
    updateSubject: @updateSubject
    updateWorkflow: @updateWorkflow
    updateClassification: @updateClassification

    geordi: @geordi

  getEnv: ->
    reg = /\W?env=(\w+)/
    browser_env = window?.location?.search?.match(reg)
    @state?.env || browser_env || 'staging'

  getInitialState: ->
    user: null
    project: null
    subject: null
    workflow: null
    classification: null
    env: @getEnv()
    initialLoadComplete: false

  updateProject: (project) ->
    @setState project: project

  updateUser: (user) ->
    @setState user: user

  updateSubject: (subject) ->
    @setState subject: subject

  updateWorkflow: (workflow) ->
    @setState workflow: workflow

  updateClassification: (classification) ->
    @setState classification: classification

  componentDidMount: ->
  updateSubject: (subject) ->
    @setState subject: subject

  componentDidMount: ->
    auth.listen 'change', @handleAuthChange
    generateSessionID()
    @handleAuthChange()

  componentWillUnmount: ->
    auth.stopListening 'change', @handleAuthChange

  componentWillUpdate: (nextProps, nextState) ->
    # because the project is a parameter to the geordi client constructor,
    # we have to rebuild the geordi client every time the project changes
    if (nextState.project isnt @state.project and nextState.project?)
      @geordi = new GeordiClient
        server: @state.env
        projectToken: nextState.project.slug
        zooUserIDGetter: () => @state.user?.id
        subjectGetter: () => @state.subject?.id

  handleAuthChange: ->
    auth.checkCurrent().then (user) =>
      @setState
        user: user
        initialLoadComplete: true

  render: ->
    <div className="panoptes-main">
      <IOStatus />
      <MainHeader user={@state.user} />
      <div className="main-content">
        {if @state.initialLoadComplete
          React.cloneElement @props.children, {user: @state.user}}
      </div>
      <MainFooter user={@state.user} />
    </div>
