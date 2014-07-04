# @cjsx React.DOM

React = require 'react'
Translator = require 'react-translator'

Translator.setStrings
  loginBar:
    signUp: 'Sign up'
    signIn: 'Sign in'

module.exports = React.createClass
  render: ->
    <div className="login-bar">
      <button><Translator>loginBar.signUp</Translator></button>
      <button><Translator>loginBar.signIn</Translator></button>
    </div>
