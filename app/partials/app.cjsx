React = require 'react'
auth = require '../api/auth'
IOStatus = require './io-status'
MainHeader = require './main-header'
{RouteHandler} = require 'react-router'
MainFooter = require './main-footer'
{generateSessionID} = require '../lib/session'

mainClassNames = # routeName: cssClass
  'home': 'on-home-page'
  'project': 'on-project-page'
  'about': 'on-secondary-page'
  'projects': 'on-secondary-page'
  'user-profile': 'on-secondary-page'
  'favorites': 'on-secondary-page'
  'collections': 'on-secondary-page'
  'lab-landing-page': 'on-secondary-page on-landing-page'

routeInCurrentRoutes = (routes, routeName) ->
  routeNames = routes.map (route) -> route.name
  routeNames.indexOf(routeName) isnt -1

appClassNames = (routes) ->
  Object.keys(mainClassNames).reduce((classList, routeName) ->
    if routeInCurrentRoutes(routes, routeName)
      classList.concat(mainClassNames[routeName])
    else
      classList
  , []).join(' ')

module.exports = React.createClass
  displayName: 'PanoptesApp'

  getInitialState: ->
    user: null
    initialLoadComplete: false

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
    <div className="panoptes-main #{appClassNames(@props.routes)}">
      <IOStatus />
      <MainHeader user={@state.user} />
      <div className="main-content">
        {if @state.initialLoadComplete
          <RouteHandler {...@props} user={@state.user} />}
      </div>
      <MainFooter user={@state.user} />
    </div>
