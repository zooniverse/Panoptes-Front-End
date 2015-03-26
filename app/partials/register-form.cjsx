counterpart = require 'counterpart'
React = require 'react'
PromiseToSetState = require '../lib/promise-to-set-state'
auth = require '../api/auth'
Translate = require 'react-translate-component'
LoadingIndicator = require '../components/loading-indicator'
Tooltip = require '../components/tooltip'
debounce = require 'debounce'
apiClient = require '../api/client'

REMOTE_CHECK_DELAY = 1000
MIN_PASSWORD_LENGTH = 8

counterpart.registerTranslations 'en',
  registerForm:
    required: 'Required'
    looksGood: 'Looks good'
    userName: 'User name'
    badChars: 'Don’t use weird characters: %(chars)s'
    nameConflict: 'That username is taken'
    forgotPassword: 'Forget your password?'
    password: 'Password'
    passwordTooShort: 'Too short'
    confirmPassword: 'Confirm password'
    passwordsDontMatch: 'These don’t match'
    email: 'Email address'
    emailConflict: 'An account with this address already exists'
    realName: 'Real name'
    why: 'Why?'
    whyRealName: 'We’ll use this to give you credit in scientific papers, posters, etc'
    agreeToPrivacyPolicy: 'You agree to our %(link)s (required)'
    privacyPolicy: 'privacy policy'
    okayToEmail: 'It’s okay to send me email every once in a while.'
    register: 'Register'
    alreadySignedIn: 'Signed in as %(name)s'
    signOut: 'Sign out'

module.exports = React.createClass
  displayName: 'RegisterForm'

  mixins: [PromiseToSetState]

  getInitialState: ->
    whyRealName: false
    user: null
    badNameChars: null
    nameConflict: null
    passwordTooShort: null
    passwordsDontMatch: null
    emailConflict: null

  componentDidMount: ->
    auth.listen @handleAuthChange
    @handleAuthChange()

  componentWillUnmount: ->
    auth.stopListening @handleAuthChange

  handleAuthChange: ->
    @promiseToSetState user: auth.checkCurrent()

  render: ->
    {badNameChars, nameConflict, passwordTooShort, passwordsDontMatch, emailConflict} = @state

    <form onSubmit={@handleSubmit}>
      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.userName" />
          {if badNameChars?.length > 0
            chars = for char in badNameChars
              <kbd key={char}>{char}</kbd>
            <Translate className="form-help error" content="registerForm.badChars" chars={chars} />
          else if "nameConflict" of @state.pending
            <LoadingIndicator />
          else if nameConflict?
            if nameConflict
              <span className="form-help error">
                <Translate content="registerForm.nameConflict" />{' '}
                <a href="https://www.zooniverse.org/password/reset" target="_blank">
                  <Translate content="registerForm.forgotPassword" />
                </a>
              </span>
            else
              <span className="form-help success">
                <Translate content="registerForm.looksGood" />
              </span>}
        </span>
        <input type="text" ref="name" className="standard-input full" disabled={@state.user?} autoFocus onChange={@handleNameChange} />
      </label>

      <br />

      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.password" />
          {if passwordTooShort
            <Translate className="form-help error" content="registerForm.passwordTooShort" />}
        </span>
        <input type="password" ref="password" className="standard-input full" disabled={@state.user?} onChange={@handlePasswordChange} />
      </label>

      <br />

      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.confirmPassword" /><br />
          {if passwordsDontMatch?
            if passwordsDontMatch
              <Translate className="form-help error" content="registerForm.passwordsDontMatch" />
            else
              <Translate className="form-help success" content="registerForm.looksGood" />}
        </span>
        <input type="password" ref="confirmedPassword" className="standard-input full" disabled={@state.user?} onChange={@handlePasswordChange} />
      </label>

      <br />

      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.email" />
          {if 'emailConflict' of @state.pending
            <LoadingIndicator />
          else if emailConflict?
            if emailConflict
              <span className="form-help error">
                <Translate content="registerForm.emailConflict" />{' '}
                <a href="https://www.zooniverse.org/password/reset" target="_blank">
                  <Translate content="registerForm.forgotPassword" />
                </a>
              </span>
            else
              <Translate className="form-help success" content="registerForm.looksGood" />
          else
            <Translate className="form-help info" content="registerForm.required" />}
        </span>
        <input type="text" ref="email" className="standard-input full" disabled={@state.user?} onChange={@handleEmailChange} />
      </label>

      <br />

      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.realName" />
          <button type="button" className="secret-button" onClick={@setState.bind this, whyRealName: not @state.whyRealName, null}>
            <Translate className="form-help info" content="registerForm.why" />
            {if @state.whyRealName
              <Tooltip attachment="middle right" targetAttachment="middle left">
                <Translate content="registerForm.whyRealName" />
              </Tooltip>}
          </button>
        </span>
        <input type="text" ref="realName" className="standard-input full" disabled={@state.user?} />
      </label>

      <br />

      <label>
        <input type="checkbox" ref="agreesToPrivacyPolicy" disabled={@state.user?} onChange={@forceUpdate.bind this, null} />
        {privacyPolicyLink = <a href="#/todo/privacy"><Translate content="registerForm.privacyPolicy" /></a>; null}
        <Translate component="span" content="registerForm.agreeToPrivacyPolicy" link={privacyPolicyLink} />
      </label>

      <br />
      <br />

      <label>
        <input type="checkbox" ref="okayToEmail" disabled={@state.user?} onChange={@forceUpdate.bind this, null} />
        <Translate component="span" content="registerForm.okayToEmail" />
      </label><br />

      <p style={textAlign: 'center'}>
        {if 'user' of @state.pending
          <LoadingIndicator />
        else if @state.user?
          <span className="form-help warning">
            <Translate content="registerForm.alreadySignedIn" name={@state.user.display_name} />{' '}
            <button type="button" className="minor-button" onClick={@handleSignOut}><Translate content="registerForm.signOut" /></button>
          </span>
        else
          <span>&nbsp;</span>}
      </p>

      <div>
        <button type="submit" className="standard-button full" disabled={not @isFormValid() or Object.keys(@state.pending).length isnt 0 or @state.user?}>
          <Translate content="registerForm.register" />
        </button>
      </div>
    </form>

  handleNameChange: ->
    name = @refs.name.getDOMNode().value

    exists = name.length isnt 0
    badChars = (char for char in name.split('') when char isnt encodeURIComponent char)

    @setState
      badNameChars: badChars
      nameConflict: null

    if exists and badChars.length is 0
      @debouncedCheckFornameConflict ?= debounce @checkFornameConflict, REMOTE_CHECK_DELAY
      @debouncedCheckFornameConflict name

  debouncedCheckFornameConflict: null
  checkFornameConflict: (display_name) ->
    @promiseToSetState nameConflict: apiClient.type('users').get({display_name}).then (users) ->
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
    @promiseToSetState emailConflict: Promise.resolve null # Cancel any existing request.

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
        .catch (error) ->
          error.message.match(/email(.+)taken/mi) ? false

  isFormValid: ->
    {badNameChars, nameConflict, passwordsDontMatch, emailConflict} = @state
    agreesToPrivacyPolicy = @refs.agreesToPrivacyPolicy?.getDOMNode().checked
    badNameChars?.length is 0 and not nameConflict and not passwordsDontMatch and not emailConflict and agreesToPrivacyPolicy

  handleSubmit: (e) ->
    e.preventDefault()
    display_name = @refs.name.getDOMNode().value
    password = @refs.password.getDOMNode().value
    email = @refs.email.getDOMNode().value
    realName = @refs.realName.getDOMNode().value
    global_email_communication = @refs.okayToEmail.getDOMNode().checked

    @props.onSubmit?()
    auth.register {display_name, password, email, global_email_communication}
      .then @props.onSuccess
      .catch @props.onFailure

  handleSignOut: ->
    auth.signOut()
