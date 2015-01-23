counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link} = require 'react-router'

counterpart.registerTranslations 'en',
  loginBar:
    signIn: 'Sign in'
    register: 'Register'

module.exports = React.createClass
  displayName: 'LoginBar'

  render: ->
    <div className="login-bar main-header-group">
      <Link to="sign-in" root={true} className="main-header-item">
        <Translate content="loginBar.signIn" />
      </Link>

      <Link to="register" className="main-header-item">
        <Translate content="loginBar.register" />
      </Link>
    </div>
