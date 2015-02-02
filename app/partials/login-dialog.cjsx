counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
SignInForm = require './sign-in-form'
RegisterForm = require './register-form'
auth = require '../api/auth'

counterpart.registerTranslations 'en',
  signInDialog:
    signIn: 'Sign in'
    register: 'Register'

module.exports = React.createClass
  displayName: 'LoginDialog'

  getDefaultProps: ->
    which: 'sign-in'

  getInitialState: ->
    which: @props.which

  render: ->
    <div className="tabbed-content" data-side="top" onSubmit={@handleSubmit}>
      <nav className="tabbed-content-tabs">
        <button type="button" className="tabbed-content-tab #{('active' if @state.which is 'sign-in') ? ''}" onClick={@goTo.bind this, 'sign-in'}>
          <Translate content="signInDialog.signIn" />
        </button>

        <button type="button" className="tabbed-content-tab #{('active' if @state.which is 'register') ? ''}" onClick={@goTo.bind this, 'register'}>
          <Translate content="signInDialog.register" />
        </button>
      </nav>

      <div className="content-container">
        {switch @state.which
          when 'sign-in' then <SignInForm onSuccess={@props.onSuccess} />
          when 'register' then <RegisterForm onSuccess={@props.onSuccess} />}
      </div>
    </div>

  goTo: (which) ->
    @setState {which}
