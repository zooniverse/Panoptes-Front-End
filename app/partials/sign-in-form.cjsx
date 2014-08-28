# @cjsx React.DOM

Translator = require 'react-translator'
React = require 'react'
loginStore = require '../data/login'
InPlaceForm = require '../components/in-place-form'
LoadingIndicator = require '../components/loading-indicator'

Translator.setStrings
  signInForm:
    signIn: 'Sign in'
    signOut: 'Sign out'
    userName: 'User name'
    password: 'Password'
    errors:
      BAD_PASSWORD: 'Wrong username or password'
      SERVER_ERROR: 'Something went wrong! Try again later.'

module.exports = React.createClass
  displayName: 'SignInForm'

  mixins: [loginStore.mixin]

  getInitialState: ->
    errors: {}

  render: ->
    disabled = loginStore.loading or loginStore.current?

    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <Translator>signInForm.userName</Translator>
          <br />
          <input type="text" name="login" value={loginStore.current?.display_name} disabled={disabled} ref="login" autoFocus="autoFocus" />

          {if @state.errors.login?
            errorString = "signInForm.errors.#{@state.errors.login}"
            <Translator className="form-help error">{errorString}</Translator>}
        </label>
      </div>
      <br />
      <div>
        <label>
          <Translator>signInForm.password</Translator>
          <br />
          <input type="password" name="password" value={loginStore.current?.password} disabled={disabled} ref="password" />

          {if @state.errors.password?
            errorString = "signInForm.errors.#{@state.errors.password}"
            <Translator className="form-help error">{errorString}</Translator>}
        </label>
      </div>
      <br />
      <div>
        <button type="submit" disabled={disabled}>
          <Translator>signInForm.signIn</Translator>
        </button>

        {if loginStore.loading
          <LoadingIndicator />}

        {if loginStore.current?
          <span className="form-help">Signed in as {loginStore.current.display_name}</span>}
      </div>
    </InPlaceForm>

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value
    signInAttempt = loginStore.signIn login, password
    signInAttempt.then ({errors, user}) =>
      errors ?= {}
      @setState {errors}
