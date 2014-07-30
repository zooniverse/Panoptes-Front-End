React = require 'react'
MainNav = require './main-nav'
AccountBar = require './account-bar'
LoginBar = require './login-bar'

module.exports = React.createClass
  displayName: 'MainHeader'

  render: ->
    React.DOM.header className: 'main-header',
      MainNav null
      React.DOM.div className: 'main-header-group'
      if @props.user?
        AccountBar user: @props.user
      else
        LoginBar null
