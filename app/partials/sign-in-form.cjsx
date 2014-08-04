# @cjsx React.DOM

Translator = require 'react-translator'
React = require 'react'
loginStore = require '../data/login'
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

  mixins: [
    loginStore.mixInto {current: 'currentUser', 'loading', 'errors'}
  ]

  getInitialState: ->
    identifier: Math.random().toString().split('.')[1]
    login: ''
    password: ''

  render: ->
    errors = @state.errors?[@state.identifier]
    console.log 'e', errors

    if @state.currentUser?
      <p>
        <span>Logged in as {@state.currentUser.real_name} ({@state.currentUser.display_name}).</span>
        <button onClick={@handleSignOut}>Sign out</button>
      </p>

    else
      <InPlaceForm onSubmit={@handleSubmit}>
        <p>
          <label>
            <Translator>signInForm.userName</Translator>
            <br />
            <input type="text" name="login" value={@state.login} onChange={@handleInputChange} autoFocus="autoFocus" />

            {if errors?.login?
              errorString = "signInForm.errors.#{errors.login}"
              <Translator className="error">{errorString}</Translator>}
          </label>
        </p>

        <p>
          <label>
            <Translator>signInForm.password</Translator>
            <br />
            <input type="password" name="password" value={@state.password} onChange={@handleInputChange} />

            {if errors?.password?
              errorString = "signInForm.errors.#{errors.password}"
              <Translator className="error">{errorString}</Translator>}
          </label>
        </p>

        <p>
          <button type="submit">
            <Translator>signInForm.signIn</Translator>
          </button>

          {if @state.loading
            <LoadingIndicator />}
        </p>
      </InPlaceForm>

  handleSignOut: ->
    dispatch 'current-user:sign-out'
    @setState password: ''

  handleInputChange: (e) ->
    stateChange = {}
    stateChange[e.target.name] = e.target.value
    @setState stateChange

  handleSubmit: ->
    dispatch 'current-user:sign-in', @state.login, @state.password, @state.identifier
