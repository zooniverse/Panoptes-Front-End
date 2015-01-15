counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
apiClient = require '../api/client'
promiseToSetState = require '../lib/promise-to-set-state'
auth = require '../api/auth'
InPlaceForm = require '../components/in-place-form'
LoadingIndicator = require '../components/loading-indicator'
debounce = require 'debounce'

REMOTE_CHECK_DELAY = 1000
MIN_PASSWORD_LENGTH = 8

counterpart.registerTranslations 'en',
  registerForm:
    required: '(required)'
    optional: '(optional)'
    looksGood: 'Looks good.'
    userName: 'User name'
    badChars: 'Don’t use weird characters: %(chars)s'
    loginConflict: 'That login is taken.'
    forgotPassword: 'Forgotten your password?'
    password: 'Password'
    passwordTooShort: 'Too short.'
    confirmPassword: 'Confirm password'
    passwordsDontMatch: 'These don’t match.'
    email: 'Email address'
    emailConflict: 'An account with this address already exists.'
    realName: 'Real name'
    whyRealName: 'We’ll use this to give you credit in scientific papers, posters, etc.'
    agreeToPrivacyPolicy: 'You agree to our %(link)s.'
    privacyPolicy: 'privacy policy'
    register: 'Register'
    alreadySignedIn: 'Already signed in as %(name)s.'
    signOut: 'Sign out'

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

    forgotPasswordLink = <a href="/todo/account/reset-password?email=#{@refs.email?.getDOMNode().value ? '?'}">
      <Translate content="registerForm.forgotPassword" />
    </a>

    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <Translate content="registerForm.userName" /><br />
          <input type="text" name="login" disabled={@state.user?} ref="login" onChange={@handleLoginChange} autoFocus />

          {if badLoginChars?.length > 0
            chars = for char in badLoginChars
              <kbd key={char}>{char}</kbd>
            <Translate component="span" className="form-help error" content="registerForm.badChars" chars={chars} />

          else if "loginConflict" in @state.awaiting
            <LoadingIndicator />
          else if loginConflict?
            if loginConflict
              <span className="form-help error">
                <Translate content="registerForm.loginConflict" />{' '}
                {forgotPasswordLink}
              </span>
            else
              <span className="form-help">
                <Translate content="registerForm.looksGood" />
              </span>}
        </label>
      </div>

      <br />

      <div>
        <label>
          <Translate content="registerForm.password" /><br />
          <input type="password" name="password" disabled={@state.user?} ref="password" onChange={@handlePasswordChange} />
          {if passwordTooShort
            <Translate className="form-help error" content="registerForm.passwordTooShort" />}
        </label>
      </div>

      <br />

      <div>
        <label>
          <Translate content="registerForm.confirmPassword" /><br />
          <input type="password" name="confirmed_password" disabled={@state.user?} ref="confirmedPassword" onChange={@handlePasswordChange} />
          {if passwordsDontMatch?
            if passwordsDontMatch
              <Translate className="form-help error" content="registerForm.passwordsDontMatch" />
            else
              <Translate className="form-help" content="registerForm.looksGood" />}
        </label>
      </div>

      <br />

      <div>
        <label>
          <Translate content="registerForm.email" /> <Translate className="form-help" content="registerForm.required" /><br />
          <input type="text" name="email" disabled={@state.user?} ref="email" onChange={@handleEmailChange} />
          {if 'emailConflict' in @state.awaiting
            <LoadingIndicator />
          else if emailConflict?
            if emailConflict
              <span className="form-help error">
                <Translate content="registerForm.emailConflict" />{' '}
                {forgotPasswordLink}
              </span>
            else
              <Translate className="form-help" content="registerForm.looksGood" />}
        </label>
      </div>

      <br />

      <div>
        <label>
          <Translate content="registerForm.realName" /> <Translate className="form-help" content="registerForm.optional" /><br />
          <input type="text" name="real_name" disabled={@state.user?} ref="realName" /><br />
          <Translate className="form-help" content="registerForm.whyRealName" />
        </label>
      </div>

      <br />

      <div>
        <label>
          <input type="checkbox" name="agrees_to_privacy_policy" disabled={@state.user?} ref="agreesToPrivacyPolicy" onChange={@forceUpdate.bind this, null} />
          {privacyPolicyLink = <a href="#/todo/privacy"><Translate content="registerForm.privacyPolicy" /></a>; null}
          <Translate component="span" content="registerForm.agreeToPrivacyPolicy" link={privacyPolicyLink} />{' '}
          <span className="form-help">(required)</span>
        </label>
      </div>

      <br />

      <div>
        <button type="submit" disabled={not @isFormValid() or @state.awaiting.length isnt 0 or @state.user?}>
          <Translate content="registerForm.register" />
        </button>{' '}

        {if 'user' in @state.awaiting
          <LoadingIndicator />
        else if @state.user?
          <span className="form-help">
            <Translate content="registerForm.alreadySignedIn" name={@state.user.display_name} />{' '}
            <button type="button" onClick={@handleSignOut}><Translate content="registerForm.signOut" /></button>
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
