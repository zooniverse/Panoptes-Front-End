# @cjsx React.DOM

React = require 'react'
Translator = require 'react-translator'

Translator.setStrings
  loginBar:
    signIn: 'Sign in!'

module.exports = React.createClass
  render: ->
    <div className="login-bar">
      <a href="#/sign-in"><Translator>loginBar.signIn</Translator></a>
    </div>
