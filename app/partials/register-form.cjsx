counterpart = require 'counterpart'
React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
PromiseToSetState = require '../lib/promise-to-set-state'
auth = require 'panoptes-client/lib/auth'
Translate = require 'react-translate-component'
LoadingIndicator = require('../components/loading-indicator').default
debounce = require 'debounce'

REMOTE_CHECK_DELAY = 1000
MIN_PASSWORD_LENGTH = 8

counterpart.registerTranslations 'en',
  registerForm:
    required: 'Required'
    optional: 'Optional'
    looksGood: 'Looks good'
    userName: 'User name'
    whyUserName: 'You’ll use this name to log in. It will be shown publicly. '
    badChars: "Only letters, numbers, '.', '_', and '-'."
    nameConflict: 'That username is taken'
    forgotPassword: 'Forget your password?'
    password: 'Password'
    passwordTooShort: 'Must be at least 8 characters'
    confirmPassword: 'Confirm password'
    passwordsDontMatch: 'These don’t match'
    email: 'Email address'
    emailConflict: 'An account with this address already exists'
    realName: 'Real name'
    realNamePatternHelp: "Enter a name, not an email address", 
    whyRealName: 'We’ll use this to give you credit in scientific papers, posters, etc'
    agreeToPrivacyPolicy: 'You agree to our %(link)s (required)'
    privacyPolicy: 'privacy policy'
    okayToEmail: 'It’s okay to send me email every once in a while. (optional)'
    betaTester: 'I’d like to help test new projects, and be emailed when they’re available. (optional)'
    underAge: 'If you are under 16 years old, tick this box and complete the form with your parent/guardian.'
    notRealName: 'Don’t use your real name.'
    guardianEmail: 'Parent/Guardian’s email address'
    underAgeConsent: '
      I confirm I am the parent/guardian and give permission for my child to register by providing my email address as the main contact address.
      Both I and my child understand and agree to the %(link)s (required)
    '
    underAgeEmail: '
      If you agree, we will periodically send email promoting new research-related projects or other information
      relating to our research. We will not use your contact information for commercial purposes. (optional)
    '
    register: 'Register'
    alreadySignedIn: 'Signed in as %(name)s'
    signOut: 'Sign out'

module.exports = createReactClass
  displayName: 'RegisterForm'
  mixins: [PromiseToSetState]

  getDefaultProps: ->
    project: {}

  getInitialState: ->
    badNameChars: null
    nameConflict: null
    passwordTooShort: null
    passwordsDontMatch: null
    emailConflict: null
    agreedToPrivacyPolicy: null
    error: null
    underAge: false

  contextTypes:
    geordi: PropTypes.object

  render: ->
    {badNameChars, nameConflict, passwordTooShort, passwordsDontMatch, emailConflict} = @state

    <form method="POST" onSubmit={@handleSubmit}>
      <label className="form-separator">
        <input type="checkbox" ref="underAge" checked={@state.underAge} disabled={@props.user?} onChange={@updateAge} />
        <Translate component="span" content="registerForm.underAge" />
      </label>

      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.userName" />
          {if badNameChars?.length > 0
            <Translate className="form-help error" content="registerForm.badChars" />
          else if "nameConflict" of @state.pending
            <LoadingIndicator />
          else if nameConflict?
            if nameConflict
              <span className="form-help error">
                <Translate content="registerForm.nameConflict" />{' '}
                <a href="#{window.location.origin}/reset-password" onClick={@props.onSuccess}>
                  <Translate content="registerForm.forgotPassword" />
                </a>
              </span>
            else
              <span className="form-help success">
                <Translate content="registerForm.looksGood" />
              </span>}
          <Translate className="form-help info right-align" content="registerForm.required" />
        </span>
        <input type="text" ref="name" className="standard-input full" disabled={@props.user?} autoFocus onChange={@handleNameChange} maxLength="255" />
        <Translate component="span" className="form-help info" content="registerForm.whyUserName" />
        {if @state.underAge
          <Translate component="span" className="form-help info" content="registerForm.notRealName" />}
      </label>

      <br />

      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.password" />
          {if passwordTooShort
            <Translate className="form-help error" content="registerForm.passwordTooShort" />}
          <Translate className="form-help info right-align" content="registerForm.required" />
        </span>
        <input type="password" ref="password" className="standard-input full" disabled={@props.user?} onChange={@handlePasswordChange} />
      </label>

      <br />

      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.confirmPassword" /><br />
          {if passwordsDontMatch?
            if passwordsDontMatch
              <Translate className="form-help error" content="registerForm.passwordsDontMatch" />
            else if not passwordTooShort
              <Translate className="form-help success" content="registerForm.looksGood" />}
          <Translate className="form-help info right-align" content="registerForm.required" />
        </span>
        <input type="password" ref="confirmedPassword" className="standard-input full" disabled={@state.props?} onChange={@handlePasswordChange} />
      </label>

      <br />

      <label>
        <span className="columns-container inline spread">
          {if @state.underAge
            <Translate content="registerForm.guardianEmail" />
          else
            <Translate content="registerForm.email" />}
          {if 'emailConflict' of @state.pending
            <LoadingIndicator />
          else if emailConflict?
            if emailConflict
              <span className="form-help error">
                <Translate content="registerForm.emailConflict" />{' '}
                <a href="#{window.location.origin}/reset-password" onClick={@props.onSuccess}>
                  <Translate content="registerForm.forgotPassword" />
                </a>
              </span>
            else
              <Translate className="form-help success" content="registerForm.looksGood" />
          else
            <Translate className="form-help info right-align" content="registerForm.required" />}
        </span>
        <input type="text" ref="email" className="standard-input full" disabled={@state.props?} onChange={@handleEmailChange} />
      </label>

      <br />

      <label>
        <span className="columns-container inline spread">
          <Translate content="registerForm.realName" />
          <Translate className="form-help info right-align" content="registerForm.optional" />
        </span>
        <input
          type="text"
          pattern='[^@]+'
          ref="realName"
          className="standard-input full"
          disabled={@props.user?}
          title={counterpart('registerForm.realNamePatternHelp')}
        />
        <Translate component="span" className="form-help info" content="registerForm.whyRealName" />
      </label>

      <br />
      <br />

      <label>
        <input type="checkbox" ref="agreesToPrivacyPolicy" disabled={@props.user?} onChange={@handlePrivacyPolicyChange} />
        {privacyPolicyLink = <a target="_blank" href="#{window.location.origin}/privacy"><Translate content="registerForm.privacyPolicy" /></a>; null}
        {if @state.underAge
          <Translate component="span" content="registerForm.underAgeConsent" link={privacyPolicyLink} />
        else
          <Translate component="span" content="registerForm.agreeToPrivacyPolicy" link={privacyPolicyLink} />}
      </label>

      <br />
      <br />

      <label>
        <input type="checkbox" ref="okayToEmail" defaultChecked={true} disabled={@props.user?} onChange={@forceUpdate.bind this, null} />
        {if @state.underAge
          <Translate component="span" content="registerForm.underAgeEmail" />
        else
          <Translate component="span" content="registerForm.okayToEmail" />}
      </label><br />

      <label>
        <input type="checkbox" ref="betaTester" disabled={@props.user?} onChange={@forceUpdate.bind this, null} />
        <Translate component="span" content="registerForm.betaTester" />
      </label><br />

      <p style={textAlign: 'center'}>
        {if 'user' of @state.pending
          <LoadingIndicator />
        else if @props.user?
          <span className="form-help warning">
            <Translate content="registerForm.alreadySignedIn" name={@props.user.login} />{' '}
            <button type="button" className="minor-button" onClick={@handleSignOut}><Translate content="registerForm.signOut" /></button>
          </span>
        else if @state.error?
          <span className="form-help error">{@state.error.toString()}</span>
        else
          <span>&nbsp;</span>}
      </p>

      <div>
        <button type="submit" className="standard-button full" disabled={not @isFormValid() or Object.keys(@state.pending).length isnt 0 or @props.user?}>
          <Translate content="registerForm.register" />
        </button>
      </div>
    </form>

  updateAge: ->
    @setState underAge: !@state.underAge

  handleNameChange: ->
    name = @refs.name.value

    exists = name.length isnt 0
    badChars = (char for char in name.split('') when char.match(/[\w\-\'\.]/) is null)

    @setState
      badNameChars: badChars
      nameConflict: null
      nameExists: exists

    if exists and badChars.length is 0
      @debouncedCheckForNameConflict ?= debounce @checkForNameConflict, REMOTE_CHECK_DELAY
      @debouncedCheckForNameConflict name

  debouncedCheckForNameConflict: null
  checkForNameConflict: (username) ->
    @promiseToSetState nameConflict: auth.register(login: username).catch (error) ->
      error.message.match(/login(.+)taken/mi) ? false

  handlePasswordChange: ->
    password = @refs.password.value
    confirmedPassword = @refs.confirmedPassword.value

    exists = password.length isnt 0
    longEnough = password.length >= MIN_PASSWORD_LENGTH
    asLong = confirmedPassword.length >= password.length
    matches = password is confirmedPassword

    @setState
      passwordTooShort: if exists then not longEnough
      passwordsDontMatch: if exists and asLong then not matches

  handleEmailChange: ->
    @promiseToSetState emailConflict: Promise.resolve null # Cancel any existing request.

    email = @refs.email.value
    if email.match /.+@.+\..+/
      @debouncedCheckForEmailConflict ?= debounce @checkForEmailConflict, REMOTE_CHECK_DELAY
      @debouncedCheckForEmailConflict email

  debouncedCheckForEmailConflict: null
  checkForEmailConflict: (email) ->
    @promiseToSetState emailConflict: auth.register({email}).catch (error) ->
      error.message.match(/email(.+)taken/mi) ? false

  handlePrivacyPolicyChange: ->
    @setState agreesToPrivacyPolicy: @refs.agreesToPrivacyPolicy.checked
  isFormValid: ->
    {badNameChars, nameConflict, passwordsDontMatch, emailConflict, agreesToPrivacyPolicy, nameExists} = @state
    badNameChars?.length is 0 and not nameConflict and not passwordsDontMatch and not emailConflict and nameExists and agreesToPrivacyPolicy

  handleSubmit: (e) ->
    @context.geordi?.logEvent type: 'register'
    e.preventDefault()
    login = @refs.name.value
    password = @refs.password.value
    email = @refs.email.value
    credited_name = @refs.realName.value
    global_email_communication = @refs.okayToEmail.checked
    project_email_communication = global_email_communication
    beta_email_communication = @refs.betaTester.checked
    project_id = @props.project?.id

    @setState error: null
    @props.onSubmit?()
    auth.register {login, password, email, credited_name, project_email_communication, global_email_communication, project_id, beta_email_communication}
      .then =>
        @props.onSuccess? arguments...
      .catch (error) =>
        @setState {error}
        @props.onFailure? arguments...

  handleSignOut: ->
    auth.signOut()
