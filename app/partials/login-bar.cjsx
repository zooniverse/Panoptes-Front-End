# @cjsx React.DOM

React = require 'react'
Translator = require 'react-translator'

Translator.setStrings
  loginBar:
    signIn: 'Sign in!'

module.exports = React.createClass
  render: ->
    <div className="login-bar main-header-group">
      <a href="#/sign-in" className="main-header-item"><Translator>loginBar.signIn</Translator></a>
    </div>
