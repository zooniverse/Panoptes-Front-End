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
      badCredentials: 'Wrong username or password'
      serverError: 'Something went wrong! Try again later.'

module.exports = React.createClass
  displayName: 'SignInForm'

  mixins: [
    loginStore.mixInto current: 'currentUser', loading: 'loading'
  ]

  getInitialState: ->
    login: ''
    password: ''

  render: ->
    if @state.currentUser?
      <p>
        <span>Logged in as {@state.currentUser.credited_name} ({@state.currentUser.display_name}).</span>
        <button onClick={@handleSignOut}>Sign out</button>
      </p>

    else
      <InPlaceForm onSubmit={@handleSubmit}>
        <p>
          <label>
            <Translator>signInForm.userName</Translator>
            <br />
            <input type="text" name="login" value={@state.login} onChange={@handleInputChange} autoFocus="autoFocus" />

            {if @state.login.errors?.login?
              <span className="error">@state.login.errors.login</span>}
          </label>
        </p>

        <p>
          <label>
            <Translator>signInForm.password</Translator>
            <br />
            <input type="password" name="password" value={@state.password} onChange={@handleInputChange} />

            {if @state.login.errors?.password?
              <span className="error">@state.login.errors.password</span>}
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
    dispatch 'current-user:sign-in', @state.login, @state.password, this
