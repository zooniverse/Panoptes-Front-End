React = require 'react'
apiClient = require '../api/client'
promiseToSetState = require '../lib/promise-to-set-state'
auth = require '../api/auth'
InPlaceForm = require '../components/in-place-form'
LoadingIndicator = require '../components/loading-indicator'
debounce = require 'debounce'

REMOTE_CHECK_DELAY = 1000
MIN_PASSWORD_LENGTH = 8

users = apiClient.createType 'users'

module.exports = React.createClass
  displayName: 'RegisterForm'

  mixins: [promiseToSetState]

  componentDidMount: ->
    @handleAuthChange()
    auth.listen @handleAuthChange

  componentWillUnmount: ->
    auth.stopListening @handleAuthChange

  handleAuthChange: ->
    @promiseToSetState user: auth.checkCurrent().catch ->
      null

  render: ->
    {badLoginChars, loginConflict, passwordTooShort, passwordsDontMatch, emailConflict} = @state
    email = @refs.email?.getDOMNode().value

    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <div>User name</div>
          <input type="text" name="login" disabled={@state.user?} ref="login" onChange={@handleLoginChange} autoFocus />

          {if badLoginChars?.length > 0
            <span className="form-help error">Don’t use weird characters ({badLoginChars.join ', '}).</span>

          else if "loginConflict" in @state.awaiting
            <LoadingIndicator />
          else if loginConflict?
            if loginConflict
              <span className="form-help error">That login is taken. <a href="#/TODO/reset-password?email=#{email || '?'}">Forget your password?</a></span>
            else
              <span className="form-help">Looks good</span>}
        </label>
      </div>

      <br />

      <div>
        <label>
          <div>Password</div>
          <input type="password" name="password" disabled={@state.user?} ref="password" onChange={@handlePasswordChange} />
          {if passwordTooShort
            <span className="form-help error">Too short</span>}
        </label>
      </div>

      <br />

      <div>
        <label>
          <div>Confirm password</div>
          <input type="password" name="confirmed_password" disabled={@state.user?} ref="confirmedPassword" onChange={@handlePasswordChange} />
          {if passwordsDontMatch?
            if passwordsDontMatch
              <span className="form-help error">These don’t match</span>
            else
              <span className="form-help success">Looks good</span>}
        </label>
      </div>

      <br />

      <div>
        <label>
          <div>Email <span className="form-help">(required)</span></div>
          <input type="text" name="email" disabled={@state.user?} ref="email" onChange={@handleEmailChange} />
          {if 'emailConflict' in @state.awaiting
            <LoadingIndicator />
          else if emailConflict?
            if emailConflict
              <span className="form-help error">An account with this address already exists. <a href="#/TODO/reset-password?email=#{email || '?'}">Forget your password?</a></span>
            else
              <span className="form-help">Looks good</span>}
        </label>
      </div>

      <br />

      <div>
        <label>
          <div>Real name <span className="form-help">(optional)</span></div>
          <input type="text" name="real_name" disabled={@state.user?} ref="realName" />
          <div className="form-help">We’ll use this to give you credit in scientific papers, posters, etc.</div>
        </label>
      </div>

      <br />

      <div>
        <label>
          <input type="checkbox" name="agrees_to_privacy_policy" disabled={@state.user?} ref="agreesToPrivacyPolicy" onChange={@forceUpdate.bind this, null} />
          You agree to our <a href="#/TODO/privacy">privacy policy</a> <span className="form-help">(required)</span>
        </label>
      </div>

      <br />

      <div>
        <button type="submit" disabled={not @isFormValid() or @state.awaiting.length isnt 0 or @state.user?}>Register</button>
        &nbsp;

        {if 'user' in @state.awaiting
          <LoadingIndicator />
        else if @state.user?
          <span className="form-help">
            Signed in as {@state.user.display_name} <button type="button" onClick={@handleSignOut}>Sign out</button>
          </span>}
      </div>
    </InPlaceForm>

  handleLoginChange: ->
    login = @refs.login.getDOMNode().value

    exists = login.length isnt 0
    badChars = (char for char in login.split('') when char isnt encodeURIComponent char)

    @setState
      badLoginChars: badChars
      loginConflict: null

    if exists and badChars.length is 0
      @debouncedCheckForLoginConflict ?= debounce @checkForLoginConflict, REMOTE_CHECK_DELAY
      @debouncedCheckForLoginConflict login

  debouncedCheckForLoginConflict: null
  checkForLoginConflict: (login) ->
    @promiseToSetState loginConflict: users.get({login}, 1).then (users) ->
      users.length isnt 0

  handlePasswordChange: ->
    password = @refs.password.getDOMNode().value
    confirmedPassword = @refs.confirmedPassword.getDOMNode().value

    exists = password.length isnt 0
    longEnough = password.length >= MIN_PASSWORD_LENGTH
    asLong = confirmedPassword.length >= password.length
    matches = password is confirmedPassword

    @setState
      passwordTooShort: if exists then not longEnough
      passwordsDontMatch: if exists and asLong then not matches

  handleEmailChange: ->
    @setState
      emailConflict: null

    email = @refs.email.getDOMNode().value
    if email.match /.+@.+\..+/
      @debouncedCheckForEmailConflicts ?= debounce @checkForEmailConflicts, REMOTE_CHECK_DELAY
      @debouncedCheckForEmailConflicts email

  debouncedCheckForEmailConflicts: null
  checkForEmailConflicts: (email) ->
    # TODO: Is there a nicer way to check for email availability?
    # This request will always throw because there's no login or password.
    # We're only concerned with the existence of any "email" error.
    @promiseToSetState emailConflict: auth._getAuthToken().then (token) ->
      data =
        authenticity_token: token
        user: {email}

      headers =
        'Content-Type': 'application/json'
        'Accept': 'application/json'

      apiClient.post '/../users', data, headers
        .catch ({errors}) ->
          errors?[0]?.message?.email?[0]?.contains('taken') ? false

  isFormValid: ->
    {badLoginChars, loginConflict, passwordsDontMatch, emailConflict} = @state
    agreesToPrivacyPolicy = @refs.agreesToPrivacyPolicy?.getDOMNode().checked
    badLoginChars?.length is 0 and not loginConflict and not passwordsDontMatch and not emailConflict and agreesToPrivacyPolicy

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value
    email = @refs.email.getDOMNode().value
    realName = @refs.realName.getDOMNode().value

    auth.register {login, password, email, realName}
      .catch (errors) ->
        for {message} in errors
          if message.email?[0].indexOf('taken') isnt -1
            @setState emailConflict: true

  handleSignOut: ->
    auth.signOut()
