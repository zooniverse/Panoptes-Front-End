React = require 'react'
MainNav = require './main-nav'
AccountBar = require './account-bar'

{header} = React.DOM

module.exports = React.createClass
  displayName: 'MainHeader'

  render: ->
    header className: 'main-header',
      MainNav null
      AccountBar null
