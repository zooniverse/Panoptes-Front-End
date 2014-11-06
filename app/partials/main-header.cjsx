# @cjsx React.DOM

React = require 'react'
LoadingIndicator = require '../components/loading-indicator'
MainNav = require './main-nav'
AccountBar = require './account-bar'
LoginBar = require './login-bar'
currentUserMixin = require '../lib/current-user'

module.exports = React.createClass
  displayName: 'MainHeader'

  mixins: [currentUserMixin]

  render: ->
    <header className="main-header">
      <MainNav />

      <div className="main-header-group"></div>

      {if @state.currentUser?.login?
        <AccountBar />
      else
        <LoginBar />}
    </header>
