React = require 'react'
auth = require '../api/auth'
IOStatus = require './io-status'
MainHeader = require './main-header'
{RouteHandler} = require 'react-router'
MainFooter = require './main-footer'

module.exports = React.createClass
  displayName: 'PanoptesApp'

  getInitialState: ->
    user: null
    initialLoadComplete: false

  componentDidMount: ->
    auth.listen 'change', @handleAuthChange
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
          <RouteHandler {...@props} user={@state.user} />}
      </div>
      <MainFooter user={@state.user} />
    </div>
