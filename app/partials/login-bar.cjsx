Translator = require 'react-translator'
React = require 'react'
{Link} = require 'react-router'

Translator.setStrings
  loginBar:
    signIn: 'Sign in'
    register: 'Register'

module.exports = React.createClass
  displayName: 'LoginBar'

  render: ->
    <div className="login-bar main-header-group">
      <Link to="sign-in" root={true} className="main-header-item">
        <Translator>loginBar.signIn</Translator>
      </Link>

      <Link to="register" className="main-header-item">
        <Translator>loginBar.register</Translator>
      </Link>
    </div>
