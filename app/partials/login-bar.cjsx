counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
alert = require '../lib/alert'
LoginDialog = require '../partials/login-dialog'

counterpart.registerTranslations 'en',
  loginBar:
    signIn: 'Sign in'
    register: 'Register'

module.exports = React.createClass
  displayName: 'LoginBar'

  contextTypes:
    geordi: React.PropTypes.object

  render: ->
    <div className="login-bar">
      <button type="button" className="secret-button" onClick={@showLoginDialog.bind this, 'sign-in'}>
        <Translate content="loginBar.signIn" />
      </button>
      <button type="button" className="secret-button" onClick={@showLoginDialog.bind this, 'register'}>
        <Translate content="loginBar.register" />
      </button>
    </div>

  showLoginDialog: (which) ->
    @context?.geordi.logEvent type: if which is 'sign-in' then 'login' else 'register-link'
    context = @context

    alert (resolve) ->
      <LoginDialog which={which} onSuccess={resolve} contextRef={context} />
