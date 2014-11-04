# @cjsx React.DOM

React = require 'react'
InPlaceForm = require '../components/in-place-form'
promiseToSetState = require '../lib/promise-to-set-state'
Auth = require '../api/auth'
auth = new Auth()
users = require '../api/users'
LoadingIndicator = require '../components/loading-indicator'
{dispatch} = require '../lib/dispatcher'

MIN_PASSWORD_LENGTH = 8

module.exports = React.createClass
  displayName: 'RegisterForm'

  mixins: [promiseToSetState]

  componentWillReceiveProps: (props) ->
    if props.currentUser
      @setState
        loginTaken: null
        emailTaken: null
    else if props.errors and props.errors[0]?.message
      {email, login} = props.errors[0].message

      @setState
        loginTaken: login
        emailTaken: email

  render: ->
    signedIn = @props.currentUser? and (not @state.errors?) and (not @props.loggingIn)
    disabled = @props.loggingIn or signedIn
    {badLoginChars, loginTaken, emailTaken, passwordTooShort, passwordsDontMatch} = @state
    email = @refs.email?.getDOMNode().value

    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <div>User name</div>
          <input type="text" name="login" disabled={disabled} ref="login" onChange={@handleLoginChange} autoFocus="autoFocus" />
          {if badLoginChars?.length > 0
            <span className="form-help error">Don’t use weird characters ({badLoginChars.join ', '}).</span>
          else if loginTaken?
            <span className="form-help error">Sorry, that login is taken. <a href="#/reset-password?email=#{email || '?'}">Forget your password?</a></span>
           }
        </label>
      </div>

      <br />

      <div>
        <label>
          <div>Password</div>
          <input type="password" name="password" disabled={disabled} ref="password" onChange={@handlePasswordChange} />
          {if passwordTooShort
            <span className="form-help error">That password is too short.</span>}
        </label>
      </div>

      <br />

      <div>
        <label>
          <div>Confirm password</div>
          <input type="password" name="confirmed_password" disabled={disabled} ref="confirmedPassword" onChange={@handlePasswordChange} />
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
          <input type="text" name="email" disabled={disabled} ref="email" onChange={@handleEmailChange} />
          {if emailTaken?
            <span className="form-help error">Sorry, that email is taken. <a href="#/reset-password?email=#{email || '?'}">Forget your password?</a></span>
          }
        </label>
      </div>

      <br />

      <div>
        <label>
          <div>Real name</div>
          <input type="text" name="real_name" disabled={disabled} ref="realName" />
          <div className="form-help">We’ll use this to give you credit in scientific papers, posters, etc.</div>
        </label>
      </div>

      <br />

      <div>
        <label>
          <input type="checkbox" name="agrees_to_privacy_policy" disabled={disabled} ref="agreesToPrivacyPolicy" onChange={@forceUpdate.bind this, null} />
          You agree to our <a href="#/privacy">privacy policy</a> <span className="form-help">(required)</span>.
        </label>
      </div>

      <br />

      <div>
        <button type="submit" disabled={disabled or not @isFormValid()}>Register</button>

        {if signedIn
          <span className="form-help">
            Signed in as {@props.currentUser.display_name}
            <button type="button" onClick={@handleSignOut}>Sign out</button>
          </span>}

        {if @state.errors?
          <span className="form-help error">{@state.errors}</span>}

        {if @props.loggingIn
          <LoadingIndicator />}

      </div>
    </InPlaceForm>

  handleLoginChange: ->
    login = @refs.login.getDOMNode().value
    badChars = (char for char in login.split('') when char isnt encodeURIComponent char)

    @setState
      badLoginChars: badChars
      loginTaken: null

  handleEmailChange: ->
    email = @refs.email.getDOMNode().value.trim()
    # validate email?
    @setState
      emailTaken: null

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

  isFormValid: ->
    {badLoginChars, loginTaken, emailTaken, passwordsDontMatch} = @state
    agreesToPrivacyPolicy = @refs.agreesToPrivacyPolicy?.getDOMNode().checked
    (badLoginChars?.length is 0) and (not loginTaken) and (not emailTaken) and (passwordsDontMatch is false) and agreesToPrivacyPolicy

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value
    confirmedPassword = @refs.confirmedPassword.getDOMNode().value
    email = @refs.email.getDOMNode().value
    realName = @refs.realName.getDOMNode().value
    agreesToPrivacyPolicy = @refs.agreesToPrivacyPolicy.getDOMNode().checked

    @setState
      loginTaken: null
      emailTaken: null

    dispatch 'current-user:sign-up', {login, password, email, realName}

  handleSignOut: ->
    dispatch 'current-user:sign-out'
    refs = ['login', 'password', 'email', 'confirmedPassword', 'agreesToPrivacyPolicy', 'realName']
    for ref in refs
      @refs[ref].getDOMNode().value = ''
