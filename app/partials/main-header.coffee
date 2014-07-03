React = require 'react'
currentUser = require '../data/current-user'
MainNav = require './main-nav'
AccountBar = require './account-bar'

{header} = React.DOM

module.exports = React.createClass
  displayName: 'MainHeader'

  getInitialState: ->
    user: null

  componentDidMount: ->
    currentUser.on 'change', this, 'handleUserChange'

  componentWillUnmount: ->
    currentUser.off 'change', this, 'handleUserChange'

  handleUserChange: ->
    @setState user: currentUser.current

  render: ->
    header className: 'main-header',
      MainNav null
      if @state.user?
        AccountBar user: @state.user
      else
        'Not signed in!'
