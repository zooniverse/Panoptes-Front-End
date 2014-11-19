Translator = require 'react-translator'
React = require 'react'
Link = require '../lib/link'

Translator.setStrings
  loginBar:
    signIn: 'Sign in'
    register: 'Register'

module.exports = React.createClass
  displayName: 'LoginBar'

  render: ->
    <div className="login-bar main-header-group">
      <Link href="/sign-in" root={true} className="main-header-item">
        <Translator>loginBar.signIn</Translator>
      </Link>

      <Link href="/sign-in/register" className="main-header-item">
        <Translator>loginBar.register</Translator>
      </Link>
    </div>
