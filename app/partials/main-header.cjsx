# @cjsx React.DOM

React = require 'react'
LoadingIndicator = require '../components/loading-indicator'
MainNav = require './main-nav'
AccountBar = require './account-bar'
LoginBar = require './login-bar'
PromiseToSetState = require '../lib/promise-to-set-state'

module.exports = React.createClass
  displayName: 'MainHeader'

  render: ->
    <header className="main-header">
      <MainNav />

      <div className="main-header-group"></div>

      {if @props.user?.login?
        <AccountBar user={@props.user} />
      else
        <LoginBar />}
    </header>
