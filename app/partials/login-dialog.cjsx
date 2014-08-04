# @cjsx React.DOM

Store = require '../data/store'
React = require 'react'
Dialog = require '../components/dialog'
SignInForm = require './sign-in-form'
{dispatch} = require '../lib/dispatcher'

loginDialogStore = new Store
  showing: false
  tab: 1

  'login-dialog:show': ->
    @showing = true

  'login-dialog:hide': ->
    @showing = false

  'login-dialog:switch-tab': (index) ->
    @tab = index

  'current-user:sign-in:success': ->
    @showing = false

LoginDialog = React.createClass
  displayName: 'LoginDialog'

  mixins: [
    loginDialogStore.mixInto {'showing', 'tab'}
  ]

  switchTab: (index) ->
    dispatch 'login-dialog:switch-tab', index

  hide: ->
    dispatch 'login-dialog:hide'

  render: ->
    if @state.showing
      console.log 'Login dialog is showing!'
      <Dialog className="columns-container" style={height: '70%'}>
        <div className="tabbed-content column" data-side="top" style={width: 640}>
          <div className="tabbed-content-tabs">
            <button className="tabbed-content-tab #{if @state.tab is 0 then 'selected' else ''}" onClick={@switchTab.bind this, 0}>Sign in</button>
            <button className="tabbed-content-tab #{if @state.tab is 1 then 'selected' else ''}" onClick={@switchTab.bind this, 1}>Register</button>
          </div>

          <div className="content-container">
            {if @state.tab is 0
              <SignInForm />
            else if @state.tab is 1
              <p>TODO: REGISTER</p>}
          </div>
        </div>

        <hr />

        <div>
          <p>TODO: SOCIAL LOGIN</p>
        </div>

        <div className="dialog-actions">
          <button onClick={@hide}>&times;</button>
        </div>
      </Dialog>

    else
      console.log 'Login dialog is not showing'
      <noscript />

module.exports = LoginDialog
