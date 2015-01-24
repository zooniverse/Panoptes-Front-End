counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
PromiseToSetState = require '../lib/promise-to-set-state'
auth = require '../api/auth'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
InPlaceForm = require '../components/in-place-form'
LoadingIndicator = require '../components/loading-indicator'

counterpart.registerTranslations 'en',
  signInForm:
    signIn: 'Sign in'
    signOut: 'Sign out'
    userName: 'User name'
    password: 'Password'

module.exports = React.createClass
  displayName: 'SignInForm'

  mixins: [PromiseToSetState]

  getInitialState: ->
    user: null

  render: ->
    # console.log 'SignInForm', 'render', JSON.stringify @state
    <ChangeListener target={auth} handler={@renderAuth} />

  renderAuth: ->
    # console.log 'SignInForm', 'renderAuth'
    <PromiseRenderer promise={auth.checkCurrent()} then={@renderUser} catch={@renderUser} />

  renderUser: (user) ->
    # console.log 'SignInForm', 'renderUser', user?
    working = @state.pending.user?
    signedIn = user? and (not @state.rejected.user?) and (not working)
    disabled = working or signedIn

    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <Translate content="signInForm.userName" /><br />
          <input type="text" name="login" value={user?.display_name} disabled={disabled} ref="login" autoFocus="autoFocus" />
        </label>
      </div>

      <br />

      <div>
        <label>
          <Translate content="signInForm.password" /><br />
          <input type="password" name="password" value={user?.password} disabled={disabled} ref="password" />
        </label>
      </div>

      <br />

      <div>
        <button type="submit" disabled={disabled}>
          <Translate content="signInForm.signIn" />
        </button>

        {if signedIn
          <span className="form-help">
            Signed in as {user.display_name}
            <button type="button" onClick={@handleSignOut}>Sign out</button>
          </span>}

        {if @state.rejected.user?
          <span className="form-help error">{@state.rejected.user.message}</span>}

        {if working
          <LoadingIndicator />}
      </div>
    </InPlaceForm>

  handleSubmit: ->
    login = @getDOMNode().querySelector('[name="login"]').value
    password = @getDOMNode().querySelector('[name="password"]').value
    @promiseToSetState user: auth.signIn {login, password}

  handleSignOut: ->
    auth.signOut().then =>
      @getDOMNode().querySelector('[name="login"]').value = ''
      @getDOMNode().querySelector('[name="password"]').value = ''
