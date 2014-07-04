React = require 'react'
currentUser = require './data/current-user'
MainHeader = require './partials/main-header'
Routed = require 'react-routed'
MainFooter = require './partials/main-footer'
currentUserActions = require './actions/current-user'

{div} = React.DOM

Main = React.createClass
  getInitialState: ->
    user: null

  componentDidMount: ->
    currentUser.on 'change', this, 'handleUserChange'

  componentWillUnmount: ->
    currentUser.off 'change', this, 'handleUserChange'

  handleUserChange: ->
    @setState user: currentUser.current

  render: ->
    div className: 'panoptes-main',
      MainHeader user: @state.user
      Routed className: 'main-content',
        Routed hash: '#/', handler: require './pages/home'
        Routed hash: '#/projects', handler: require './pages/projects'
        Routed hash: '#/edit/account', handler: require './pages/edit-account'
      MainFooter null

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

currentUserActions.check()

React.renderComponent Main(null), mainContainer
