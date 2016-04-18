React = require 'react'
auth = require 'panoptes-client/lib/auth'
IOStatus = require './io-status'
MainHeader = require './main-header'
MainFooter = require './main-footer'
{generateSessionID} = require '../lib/session'

module.exports = React.createClass
  displayName: 'PanoptesApp'

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

  getInitialState: ->
    user: null
    project: null
    subject: null
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
