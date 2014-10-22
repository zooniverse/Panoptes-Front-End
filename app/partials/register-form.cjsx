# @cjsx React.DOM

React = require 'react'
InPlaceForm = require '../components/in-place-form'
promiseToSetState = require '../lib/promise-to-set-state'
auth = require '../api/auth'
users = require '../api/users'
LoadingIndicator = require '../components/loading-indicator'
{dispatch} = require '../lib/dispatcher'

MIN_PASSWORD_LENGTH = 8

module.exports = React.createClass
  displayName: 'RegisterForm'

  mixins: [promiseToSetState]

  componentDidMount: ->
    @handleAuthChange()
    auth.listen @handleAuthChange

  componentWillUnmount: ->
    auth.stopListening @handleAuthChange

  handleAuthChange: ->
    @promiseToSetState user: auth.checkCurrent()

  render: ->
    working = @state.user instanceof Promise
    signedIn = @state.user? and (not @state.errors?) and (not working)
    disabled = working or signedIn
    {badLoginChars, loginTaken, passwordTooShort, passwordsDontMatch} = @state
    email = @refs.email?.getDOMNode().value

    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <div>User name</div>
          <input type="text" name="login" disabled={disabled} ref="login" onChange={@handleLoginChange} autoFocus="autoFocus" />
          {if badLoginChars?.length > 0
            <span className="form-help error">Don’t use weird characters ({badLoginChars.join ', '}).</span>
          else if loginTaken?
            if loginTaken instanceof Promise
              <LoadingIndicator className="form-help" />
            else if loginTaken instanceof Error
              <span className="form-help error"><i className="fa fa-exclamation-triangle"></i> Can’t determine this login’s availability.</span>
            else if loginTaken.length isnt 0
              <span className="form-help error">Sorry, that login is taken. <a href="#/reset-password?email=#{email || '?'}">Forget your password?</a></span>
            else if loginTaken.length is 0
              <span className="form-help success">Looks good.</span>}
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
          <input type="text" name="email" disabled={disabled} ref="email" onChange={@forceUpdate.bind this, null} />
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
            Signed in as {@state.user.display_name}
            <button type="button" onClick={@handleSignOut}>Sign out</button>
          </span>}

        {if @state.errors?
          <span className="form-help error">{@state.errors}</span>}

        {if working
          <LoadingIndicator />}

      </div>
    </InPlaceForm>

  handleLoginChange: ->
    login = @refs.login.getDOMNode().value

    exists = login.length isnt 0
    badChars = (char for char in login.split('') when char isnt encodeURIComponent char)

    @setState
      badLoginChars: badChars
      loginTaken: null

    if exists and badChars.length is 0
      @promiseToSetState loginTaken: users.get {login}, 1

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
    {badLoginChars, loginTaken, passwordsDontMatch} = @state
    agreesToPrivacyPolicy = @refs.agreesToPrivacyPolicy?.getDOMNode().checked

    (badLoginChars?.length is 0) and (loginTaken is false) and (passwordsDontMatch is false) and agreesToPrivacyPolicy

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value
    confirmedPassword = @refs.confirmedPassword.getDOMNode().value
    email = @refs.email.getDOMNode().value
    realName = @refs.realName.getDOMNode().value
    agreesToPrivacyPolicy = @refs.agreesToPrivacyPolicy.getDOMNode().checked

    auth.register {login, password, email, realName}
      .catch (errors) ->
        @setState {errors}

  handleSignOut: ->
    auth.signOut()
