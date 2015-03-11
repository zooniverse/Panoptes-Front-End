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
    incorrectDetails: 'Username or password incorrect'
    forgotPassword: 'Forget your password?'

module.exports = React.createClass
  displayName: 'SignInForm'

  getInitialState: ->
    busy: false
    currentUser: null
    display_name: ''
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
          @setState display_name: currentUser.display_name, password: '********'
        @setState busy: false

  render: ->
    disabled = @state.currentUser? or @state.busy

    <form onSubmit={@handleSubmit}>
      <label>
        <Translate content="signInForm.userName" />
        <input type="text" className="standard-input full" name="display_name" value={@state.display_name} disabled={disabled} autoFocus onChange={@handleInputChange} />
      </label>

      <br />

      <label>
        <Translate content="signInForm.password" /><br />
        <input type="password" className="standard-input full" name="password" value={@state.password} disabled={disabled} onChange={@handleInputChange} />
      </label>

      <p style={textAlign: 'center'}>
        {if @state.currentUser?
          <div className="form-help">
            Signed in as {@state.currentUser.display_name}{' '}
            <button type="button" className="minor-button" onClick={@handleSignOut}>Sign out</button>
          </div>

        else if @state.error?
          <div className="form-help error">
            {if @state.error.message.match /invalid(.+)password/i
              <Translate content="signInForm.incorrectDetails" />
            else
              <span>{@state.error.toString()}</span>}{' '}

            <a href="https://www.zooniverse.org/password/reset" target="_blank">
              <Translate content="signInForm.forgotPassword" />
            </a>
          </div>

        else if @state.busy
          <LoadingIndicator />

        else
          <span>&nbsp;</span>}
      </p>

      <button type="submit" className="standard-button full" disabled={disabled or @state.display_name.length is 0 or @state.password.length is 0}>
        <Translate content="signInForm.signIn" />
      </button>
    </form>

  handleInputChange: (e) ->
    newState = {}
    newState[e.target.name] = e.target.value
    @setState newState

  handleSubmit: (e) ->
    e.preventDefault()
    @setState working: true, =>
      {display_name, password} = @state
      auth.signIn {display_name, password}
        .then (user) =>
          @setState working: false, error: null, =>
            @props.onSuccess? user
        .catch (error) =>
          @setState working: false, error: error, =>
            @getDOMNode().querySelector('[name="display_name"]')?.focus()
            @props.onFailure? error
      @props.onSubmit? e

  handleSignOut: ->
    @setState busy: true, =>
      auth.signOut().then =>
        @setState busy: false, password: ''
