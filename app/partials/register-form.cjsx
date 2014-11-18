React = require 'react'
InPlaceForm = require '../components/in-place-form'
currentUserMixin = require '../lib/current-user'
users = require '../api/users'
LoadingIndicator = require '../components/loading-indicator'
{dispatch} = require '../lib/dispatcher'

MIN_PASSWORD_LENGTH = 8

module.exports = React.createClass
  displayName: 'RegisterForm'

  mixins: [currentUserMixin]

  render: ->
    { badLoginChars, loginTaken, passwordTooShort, passwordsDontMatch, emailInvalid, emailTaken } = @state.signUpErrors
    email = @refs.email?.getDOMNode().value

    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <div>User name</div>
          <input type="text" name="login" disabled={@isDisabled()} ref="login" onChange={@handleLoginChange} autoFocus="autoFocus" />
          {if badLoginChars?.length > 0
            <span className="form-help error">Don’t use weird characters ({badLoginChars.join ', '}).</span>
          else if loginTaken?
            if loginTaken instanceof Promise
              <LoadingIndicator className="form-help" />
            else if loginTaken instanceof Error
              <span className="form-help error"><i className="fa fa-exclamation-triangle"></i> Can’t determine this login’s availability.</span>
            else if loginTaken
              <span className="form-help error">Sorry, that login is taken. <a href="#/reset-password?email=#{email || '?'}">Forget your password?</a></span>
            else
              <span className="form-help success">Looks good.</span>}
        </label>
      </div>

      <br />

      <div>
        <label>
          <div>Password</div>
          <input type="password" name="password" disabled={@isDisabled()} ref="password" onChange={@handlePasswordChange} />
          {if passwordTooShort
            <span className="form-help error">That password is too short.</span>}
        </label>
      </div>

      <br />

      <div>
        <label>
          <div>Confirm password</div>
          <input type="password" name="confirmed_password" disabled={@isDisabled()} ref="confirmedPassword" onChange={@handlePasswordChange} />
          {if passwordsDontMatch is true
            <span className="form-help error">These passwords don’t match!</span>
          else if passwordsDontMatch is false
            <span className="form-help success">They match!</span>}
        </label>
      </div>

      <br />

      <div>
        <label>
          <div>Email</div>
          <input type="text" name="email" disabled={@isDisabled()} ref="email" onChange={@handleEmailChange} />
          {if emailInvalid
            <span className="form-help error">Email address is not valid.</span>
          else if emailTaken
            <span className="form-help error">Sorry, that email is taken. <a href="#/reset-password?email=#{email || '?'}">Forget your password?</a></span>
          }
        </label>
      </div>

      <br />

      <div>
        <label>
          <div>Real name</div>
          <input type="text" name="real_name" disabled={@isDisabled()} ref="realName" />
          <div className="form-help">We’ll use this to give you credit in scientific papers, posters, etc.</div>
        </label>
      </div>

      <br />

      <div>
        <label>
          <input type="checkbox" name="agrees_to_privacy_policy" disabled={@isDisabled()} ref="agreesToPrivacyPolicy" onChange={@forceUpdate.bind this, null} />
          You agree to our <a href="#/privacy">privacy policy</a> <span className="form-help">(required)</span>.
        </label>
      </div>

      <br />

      <div>
        <button type="submit" disabled={@isDisabled() or not @isFormValid()}>Register</button>

        {if @isSignedIn()
          <span className="form-help">
            Signed in as {@state.currentUser.display_name}
            <button type="button" onClick={@handleSignOut}>Sign out</button>
          </span>}

        {if @state.hasSignUpErrors
          <span className="form-help error">{@state.signUpErrors}</span>}

        {if @state.currentUserLoading
          <LoadingIndicator />}

      </div>
    </InPlaceForm>

  handleLoginChange: ->
    login = @refs.login.getDOMNode().value

    exists = login.length isnt 0
    badChars = (char for char in login.split('') when char isnt encodeURIComponent char)

    @mergeSignUpErrors
      badLoginChars: badChars
      loginTaken: false

    if exists and badChars.length is 0
      # Check login uniqueness once endpoint exists
      # @promiseToSetState loginTaken: users.get {login}, 1
      @promiseToSetState loginTaken: Promise.resolve(false)

  handleEmailChange: ->
    email = @refs.email.getDOMNode().value
    # validate email?

    @mergeSignUpErrors
      emailTaken: false
      emailInvalid: false

  handlePasswordChange: ->
    password = @refs.password.getDOMNode().value
    confirmedPassword = @refs.confirmedPassword.getDOMNode().value

    exists = password.length isnt 0
    longEnough = password.length >= MIN_PASSWORD_LENGTH
    asLong = confirmedPassword.length >= password.length
    matches = password is confirmedPassword

    @mergeSignUpErrors
      passwordTooShort: if exists then not longEnough
      passwordsDontMatch: if exists and asLong then not matches

  isFormValid: ->
    { badLoginChars, loginTaken, passwordsDontMatch, emailTaken, emailInvalid } = @state.signUpErrors
    agreesToPrivacyPolicy = @refs.agreesToPrivacyPolicy?.getDOMNode().checked
    badLoginChars?.length is 0 and
      not loginTaken and
      not passwordsDontMatch and
      not emailTaken and
      not emailInvalid and
      agreesToPrivacyPolicy

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value
    confirmedPassword = @refs.confirmedPassword.getDOMNode().value
    email = @refs.email.getDOMNode().value
    realName = @refs.realName.getDOMNode().value
    agreesToPrivacyPolicy = @refs.agreesToPrivacyPolicy.getDOMNode().checked
    
    @handleSignUp {login, password, email, realName}
  
  mergeSignUpErrors: (changes) ->
    newErrors = Object.assign { }, @state.signUpErrors, changes
    @setState
      signUpErrors: newErrors
      hasSignUpErrors: Object.keys(newErrors).length is 0
