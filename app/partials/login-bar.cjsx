# @cjsx React.DOM

React = require 'react'
appState = require '../data/app-state'
Translator = require 'react-translator'

Translator.setStrings
  loginBar:
    signIn: 'Sign in!'

module.exports = React.createClass
  render: ->
    <div className="login-bar main-header-group">
      <button className="main-header-item" onClick={appState.set.bind appState, 'showLoginDialog', true}>
        <Translator>loginBar.signIn</Translator>
      </button>
    </div>
