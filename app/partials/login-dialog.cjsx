# cjsx React.DOM

React = require 'react'
Dialog = require '../components/dialog'
SignInForm = require './sign-in-form'
appState = require '../data/app-state'

LoginDialog = React.createClass
  getInitialState: ->
    tab: 0

  switchTab: (index) ->
    @setState tab: index

  render: ->
    <Dialog className="columns-container" style={height: '70%'}>
      <div className="tabbed-content column" data-side="top" style={width: 640}>
        <div className="tabbed-content-tabs">
          <button className="tabbed-content-tab #{if @state.tab is 0 then 'selected' else ''}" onClick={@switchTab.bind this, 0}>Sign in</button>
          <button className="tabbed-content-tab #{if @state.tab is 1 then 'selected' else ''}" onClick={@switchTab.bind this, 1}>Register</button>
        </div>

        {if @state.tab is 0
          <SignInForm className="content-container" />
        else if @state.tab is 1
          <div className="content-container">
            <p>TODO: REGISTER</p>
          </div>}
      </div>

      <hr />

      <div>
        <p>TODO: SOCIAL LOGIN</p>
      </div>

      <div className="dialog-action">
        <button onClick={appState.set.bind appState, 'showLoginDialog', false}>Close</button>
      </div>
    </Dialog>

module.exports = LoginDialog
