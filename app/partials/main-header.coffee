React = require 'react'
MainNav = require './main-nav'
AccountBar = require './account-bar'
LoginBar = require './login-bar'

module.exports = React.createClass
  displayName: 'MainHeader'

  render: ->
    React.DOM.header className: 'main-header',
      MainNav null
      if @props.user?
        AccountBar user: @props.user
      else
        LoginBar null
