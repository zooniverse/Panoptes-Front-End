# @cjsx React.DOM

Translator = require 'react-translator'
React = require 'react'
{dispatch} = require '../lib/dispatcher'

Translator.setStrings
  loginBar:
    signIn: 'Sign in'
    register: 'Register'

module.exports = React.createClass
  displayName: 'LoginBar'

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
