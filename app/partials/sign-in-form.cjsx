counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
promiseToSetState = require '../lib/promise-to-set-state'
InPlaceForm = require '../components/in-place-form'
LoadingIndicator = require '../components/loading-indicator'
auth = require '../api/auth'

counterpart.registerTranslations 'en',
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

  mixins: [promiseToSetState]

  componentDidMount: ->
    @handleAuthChange()
    auth.listen @handleAuthChange

  componentWillUnmount: ->
    auth.stopListening @handleAuthChange

  handleAuthChange: ->
    @promiseToSetState user: auth.checkCurrent()

  render: ->
    working = @state.user instanceof Promise
    signedIn = @state.user? and (not @state.errors?) and (not working)
    disabled = working or signedIn

    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <Translate content="signInForm.userName" />
          <br />
          <input type="text" name="login" value={@props.currentLogin?.display_name} disabled={disabled} ref="login" autoFocus="autoFocus" />
        </label>
      </div>

      <br />

      <div>
        <label>
          <Translate content="signInForm.password" />
          <br />
          <input type="password" name="password" value={@props.currentLogin?.password} disabled={disabled} ref="password" />
        </label>
      </div>

      <br />

      <div>
        <button type="submit" disabled={disabled}>
          <Translate content="signInForm.signIn" />
        </button>

        {if signedIn
          <span className="form-help">Signed in as {@state.user.display_name} <button onClick={@handleSignOut}>Sign out</button></span>}

        {if @state.errors?
          <span className="form-help error">{@state.errors}</span>}

        {if working
          <LoadingIndicator />}
      </div>
    </InPlaceForm>

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value

    auth.signIn {login, password}
      .then =>
        @setState errors: null

      .catch (errors) =>
        @setState errors: errors

  handleSignOut: ->
    auth.signOut().then =>
      @refs.login.getDOMNode().value = ''
      @refs.password.getDOMNode().value = ''
