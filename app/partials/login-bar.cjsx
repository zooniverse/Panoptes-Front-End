# @cjsx React.DOM

React = require 'react'
appState = require '../data/app-state'
appActions = require '../actions/app'
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
      <button className="main-header-item" onClick={appActions.showLoginDialog.bind null, 0}>
        <Translator>loginBar.signIn</Translator>
      </button>

      <button className="main-header-item" onClick={appActions.showLoginDialog.bind null, 1}>
        <Translator>loginBar.register</Translator>
      </button>
    </div>
