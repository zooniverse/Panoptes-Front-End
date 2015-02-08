counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
auth = require '../api/auth'
LoadingIndicator = require '../components/loading-indicator'

counterpart.registerTranslations 'en',
  signInForm:
    signIn: 'Sign in'
    signOut: 'Sign out'
    userName: 'User name'
    password: 'Password'
    incorrectDetails: 'Login or password incorrect'
    forgotPassword: 'Forget your password?'

module.exports = React.createClass
  displayName: 'SignInForm'

  getInitialState: ->
    busy: false
    currentUser: null
    login: ''
    password: ''
    error: null

  componentDidMount: ->
    auth.listen @handleAuthChange
    @handleAuthChange()

  componentWillUnmount: ->
    auth.stopListening @handleAuthChange

  handleAuthChange: ->
    @setState busy: true, =>
      auth.checkCurrent().then (currentUser) =>
        @setState {currentUser}
        if currentUser?
          @setState login: currentUser.display_name, password: '********'
        @setState busy: false

  render: ->
    disabled = @state.currentUser? or @state.busy

    <form onSubmit={@handleSubmit}>
      <label>
        <Translate content="signInForm.userName" /><br />
        <input type="text" name="login" value={@state.login} disabled={disabled} autoFocus onChange={@handleInputChange} />
      </label><br />

      <label>
        <Translate content="signInForm.password" /><br />
        <input type="password" name="password" value={@state.password} disabled={disabled} onChange={@handleInputChange} />
      </label><br />

      <button type="submit" disabled={disabled or @state.login.length is 0 or @state.password.length is 0}>
        <Translate content="signInForm.signIn" />
      </button>{' '}

      {if @state.busy
        <LoadingIndicator />}

      {if @state.currentUser?
        <div className="form-help">
          Signed in as {@state.currentUser.display_name}{' '}
          <button type="button" onClick={@handleSignOut}>Sign out</button>
        </div>}

      {if @state.error?
        <div className="form-help error">
          {if @state.error.message.match /invalid(.+)password/i
            <Translate content="signInForm.incorrectDetails" />
          else
            <span>{@state.error.toString()}</span>}{' '}

          <a href="https://www.zooniverse.org/password/reset" target="_blank">
            <Translate content="signInForm.forgotPassword" />
          </a>
        </div>}
    </form>

  handleInputChange: (e) ->
    newState = {}
    newState[e.target.name] = e.target.value
    @setState newState

  handleSubmit: (e) ->
    e.preventDefault()
    @setState working: true, =>
      {login, password} = @state
      auth.signIn {login, password}
        .then (user) =>
          @setState working: false, error: null, =>
            @props.onSuccess? user
        .catch (error) =>
          @setState working: false, error: error, =>
            @getDOMNode().querySelector('[name="login"]')?.focus()
            @props.onFailure? error
      @props.onSubmit? e

  handleSignOut: ->
    @setState busy: true, =>
      auth.signOut().then =>
        @setState busy: false, password: ''
