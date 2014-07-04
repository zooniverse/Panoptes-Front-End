React = require 'react'
MainNav = require './main-nav'
AccountBar = require './account-bar'
LoginBar = require './login-bar'

{header} = React.DOM

module.exports = React.createClass
  displayName: 'MainHeader'

  render: ->
    header className: 'main-header',
      MainNav null
      if @props.user?
        AccountBar user: @props.user
      else
        LoginBar null
