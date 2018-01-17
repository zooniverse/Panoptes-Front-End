counterpart = require 'counterpart'
React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
Translate = require 'react-translate-component'
SignInForm = require './sign-in-form'
RegisterForm = require './register-form'
LoginChangeForm = require './login-change-form'

counterpart.registerTranslations 'en',
  signInDialog:
    signIn: 'Sign in'
    register: 'Register'

module.exports = createReactClass
  displayName: 'LoginDialog'

  getDefaultProps: ->
    which: 'sign-in'
    project: {}

  getInitialState: ->
    which: @props.which

  childContextTypes:
    geordi: PropTypes.object

  getChildContext: ->
    geordi: @props.contextRef?.geordi

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
          when 'login-change' then <LoginChangeForm user={@props.user} onSuccess={@props.onSuccess} />
          when 'sign-in' then <SignInForm user={@props.user} onSuccess={@onSuccessOrLoginChange} />
          when 'register' then <RegisterForm project={@props.project} onSuccess={@props.onSuccess} />}
      </div>
    </div>

  goTo: (which) ->
    @setState {which}

  onSuccessOrLoginChange: (user) ->
    if user.login_prompt
      @setState {which: 'login-change', user: user}
    else
      @props.onSuccess(user)
