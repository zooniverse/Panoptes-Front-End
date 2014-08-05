# @cjsx React.DOM

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
    <header className="main-header">
      <MainNav />

      <div className="main-header-group"></div>

      {if @state.login.loading
        <div className="main-header-group">
          <div className="main-header-item">
            <LoadingIndicator />
          </div>
        </div>

      else if @state.login.current?
        <AccountBar user={@state.login.current} />

      else
        <LoginBar />}
    </header>
