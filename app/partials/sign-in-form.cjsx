counterpart = require 'counterpart'
React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
ReactDOM = require 'react-dom'
Translate = require 'react-translate-component'
auth = require 'panoptes-client/lib/auth'
LoadingIndicator = require('../components/loading-indicator').default

counterpart.registerTranslations 'en',
  signInForm:
    signIn: 'Sign in'
    signOut: 'Sign out'
    userName: 'User name or email address'
    password: 'Password'
    incorrectDetails: 'Username or password incorrect'
    forgotPassword: 'Forget your password?'

module.exports = createReactClass
  displayName: 'SignInForm'

  contextTypes:
    geordi: PropTypes.object

  getInitialState: ->
    busy: false
    login: ''
    password: ''
    error: null

  render: ->
    disabled = @props.user? or @state.busy

    <form method="POST" onSubmit={@handleSubmit}>
      <label>
        <Translate content="signInForm.userName" />
        <input type="text" className="standard-input full" name="login" value={@props.user?.login} disabled={disabled} autoFocus onChange={@handleInputChange} maxLength="255" />
      </label>

      <br />

      <label>
        <Translate content="signInForm.password" /><br />
        <input type="password" className="standard-input full" name="password" value={@props.user?.password} disabled={disabled} onChange={@handleInputChange} />
      </label>

      <p style={textAlign: 'center'}>
        {if @props.user?
          <div className="form-help">
            Signed in as {@props.user.login}{' '}
            <button type="button" className="minor-button" onClick={@handleSignOut}>Sign out</button>
          </div>

        else if @state.error?
          <div className="form-help error">
            {if @state.error.message.match /invalid(.+)password/i
              <Translate content="signInForm.incorrectDetails" />
            else
              <span>{@state.error.toString()}</span>}{' '}

            <a href="#{window.location.origin}/reset-password" onClick={@props.onSuccess}>
              <Translate content="signInForm.forgotPassword" />
            </a>
          </div>

        else if @state.busy
          <LoadingIndicator />

        else
          <a href="#{window.location.origin}/reset-password" onClick={@props.onSuccess}>
            <Translate content="signInForm.forgotPassword" />
          </a>}
      </p>

      <button type="submit" className="standard-button full" disabled={disabled or @state.login.length is 0 or @state.password.length is 0} onClick={@context.geordi?.logEvent type: 'login'}>
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
      {login, password} = @state
      auth.signIn {login, password}
        .then (user) =>
          @setState working: false, error: null, =>
            @props.onSuccess? user
        .catch (error) =>
          @setState working: false, error: error, =>
            ReactDOM.findDOMNode(@).querySelector('[name="login"]')?.focus()
            @props.onFailure? error
      @props.onSubmit? e

  handleSignOut: ->
    @setState busy: true, =>
      auth.signOut().then =>
        @setState busy: false, password: ''
