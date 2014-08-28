# @cjsx React.DOM

React = require 'react'
LoadingIndicator = require '../components/loading-indicator'
MainNav = require './main-nav'
AccountBar = require './account-bar'
LoginBar = require './login-bar'

module.exports = React.createClass
  displayName: 'MainHeader'

  render: ->
    <header className="main-header">
      <MainNav />

      <div className="main-header-group"></div>

      {if @props.loading
        <div className="main-header-group">
          <div className="main-header-item">
            <LoadingIndicator />
          </div>
        </div>

      else if @props.login
        <AccountBar user={@props.login} />

      else
        <LoginBar />}
    </header>
