React = require 'react'
loginStore = require '../data/login'
LoadingIndicator = require '../components/loading-indicator'
MainNav = require './main-nav'
AccountBar = require './account-bar'
LoginBar = require './login-bar'

module.exports = React.createClass
  displayName: 'MainHeader'

  mixins: [
    loginStore.mixInto 'login'
  ]

  render: ->
    React.DOM.header className: 'main-header',
      MainNav null

      React.DOM.div className: 'main-header-group'

      if @state.login.loading
        React.DOM.div className: 'main-header-group',
          React.DOM.div className: 'main-header-item',
            LoadingIndicator null

      else if @state.login.current?
        AccountBar user: @state.login.current

      else
        LoginBar null
