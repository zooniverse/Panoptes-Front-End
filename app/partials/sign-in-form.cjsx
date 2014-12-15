Translator = require 'react-translator'
React = require 'react'
currentUserMixin = require '../lib/current-user'
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

  mixins: [currentUserMixin]

  render: ->
    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <Translator>signInForm.userName</Translator>
          <br />
          <input type="text" name="login" value={@props.currentLogin?.display_name} disabled={@isDisabled()} ref="login" autoFocus="autoFocus" />
        </label>
      </div>

      <br />

      <div>
        <label>
          <Translator>signInForm.password</Translator>
          <br />
          <input type="password" name="password" value={@props.currentLogin?.password} disabled={@isDisabled()} ref="password" />
        </label>
      </div>

      <br />

      <div>
        <button type="submit" disabled={@isDisabled()}>
          <Translator>signInForm.signIn</Translator>
        </button>

        {if @isSignedIn()
          <span className="form-help">Signed in as {@state.currentUser.display_name} <button onClick={@handleSignOutClick}>Sign out</button></span>}

        {if @state.hasSignInErrors
          <span className="form-help error">{@state.signInErrors}</span>}

        {if @state.currentUserLoading
          <LoadingIndicator />}
      </div>
    </InPlaceForm>

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value
    @handleSignIn { login, password }

  handleSignOutClick: ->
    @handleSignOut().then =>
      @refs.login.getDOMNode().value = ''
      @refs.password.getDOMNode().value = ''
