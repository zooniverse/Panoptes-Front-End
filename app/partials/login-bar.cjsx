# @cjsx React.DOM

React = require 'react'
{dispatch} = require '../data/dispatcher'
appState = require '../data/app-state'
Translator = require 'react-translator'

Translator.setStrings
  loginBar:
    signIn: 'Sign in'
    register: 'Register'

module.exports = React.createClass
  displayName: 'LoginBar'

  mixins: [appState.mixInto {'showingLoginDialog'}]

  render: ->
    <div className="login-bar main-header-group">
      <button className="main-header-item" onClick={@handleSignInClick}>
        <Translator>loginBar.signIn</Translator>
      </button>

      <button className="main-header-item" onClick={@handleRegisterClick}>
        <Translator>loginBar.register</Translator>
      </button>
    </div>

  handleSignInClick: ->
    dispatch 'login-dialog:show'
    dispatch 'login-dialog:switch-tab', 0

  handleRegisterClick: ->
    dispatch 'login-dialog:show'
    dispatch 'login-dialog:switch-tab', 1
