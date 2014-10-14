# @cjsx React.DOM

React = require 'react'
LoadingIndicator = require '../components/loading-indicator'
MainNav = require './main-nav'
AccountBar = require './account-bar'
LoginBar = require './login-bar'
PromiseToSetState = require '../lib/promise-to-set-state'
auth = require '../api/auth'

module.exports = React.createClass
  displayName: 'MainHeader'

  mixins: [PromiseToSetState]

  componentDidMount: ->
    auth.listen @handleAuthChange

  componentWillUnmount: ->
    auth.stopListening @handleAuthChange

  handleAuthChange: ->
    @promiseToSetState user: auth.checkCurrent()

  render: ->
    console.log 'Rendering with', @state.user

    <header className="main-header">
      <MainNav />

      <div className="main-header-group"></div>

      {if @state.user?.login?
        <AccountBar user={@state.user} />
      else
        <LoginBar />}
    </header>
