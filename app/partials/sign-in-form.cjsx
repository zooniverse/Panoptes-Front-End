# @cjsx React.DOM

Translator = require 'react-translator'
React = require 'react'
InPlaceForm = require '../components/in-place-form'
LoadingIndicator = require '../components/loading-indicator'
{dispatch} = require '../lib/dispatcher'

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

  getInitialState: ->
    { }

  render: ->
    signedIn = @props.currentUser? and (not @props.errors?) and (not @props.loggingIn)
    disabled = @props.loggingIn or signedIn

    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <Translator>signInForm.userName</Translator>
          <br />
          <input type="text" name="login" value={@props.currentUser?.display_name} disabled={disabled} ref="login" autoFocus="autoFocus" />
        </label>
      </div>

      <br />

      <div>
        <label>
          <Translator>signInForm.password</Translator>
          <br />
          <input type="password" name="password" value={@props.currentUser?.password} disabled={disabled} ref="password" />
        </label>
      </div>

      <br />

      <div>
        <button type="submit" disabled={disabled}>
          <Translator>signInForm.signIn</Translator>
        </button>

        {if signedIn
          <span className="form-help">Signed in as {@props.currentUser.display_name} <button onClick={@handleSignOut}>Sign out</button></span>}

        {if @props.errors?
          <span className="form-help error">{@props.errors}</span>}

        {if @props.loggingIn
          <LoadingIndicator />}
      </div>
    </InPlaceForm>

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value
    dispatch 'current-user:sign-in', {login, password}

  handleSignOut: ->
    dispatch 'current-user:sign-out'
    @refs.login.getDOMNode().value = ''
    @refs.password.getDOMNode().value = ''
