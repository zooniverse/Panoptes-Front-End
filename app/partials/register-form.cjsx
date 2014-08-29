# @cjsx React.DOM

React = require 'react'
InPlaceForm = require '../components/in-place-form'
LoadingIndicator = require '../components/loading-indicator'
{dispatch} = require '../lib/dispatcher'

CHECKING = 'CHECKING'

module.exports = React.createClass
  displayName: 'RegisterForm'

  getInitialState: ->
    {}

  render: ->
    disabled = @props.loggingIn or @props.currentLogin?
    {badLoginChars, loginTaken, passwordTooShort, passwordsDontMatch} = @state
    email = @refs.email?.getDOMNode().value

    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <div>User name</div>
          <input type="text" name="login" defaultValue={@props.currentLogin?.display_name} disabled={disabled} ref="login" onChange={@handleLoginChange} autoFocus="autoFocus" />
          {if badLoginChars?.length > 0
            <span className="form-help error">Don't use weird characters ({badLoginChars.join ', '}).</span>
          else if loginTaken is true
            <span className="form-help error">Sorry, that login is taken. <a href="#/reset-password?email=#{email || '?'}">Forget your password?</a></span>
          else if loginTaken is false
            <span className="form-help success">Looks good.</span>
          else if loginTaken is CHECKING
            <LoadingIndicator className="form-help" />}
        </label>
      </div>
      <br />
      <div>
        <label>
          <div>Password</div>
          <input type="password" name="password" defaultValue={@props.currentLogin?.password} disabled={disabled} ref="password" onChange={@handlePasswordChange} />
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
            <span className="form-help error">These passwords don't match!</span>
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
          <div className="form-help">We'll use this to give you credit in scientific papers, posters, etc.</div>
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
      @setState
        loginTaken: CHECKING

      checkTaken = new Promise (resolve) ->
        matches = []
        if Math.random() < 0.5
          matches.push true
        setTimeout resolve.bind(this, matches), 1000

      checkTaken.then (matches) =>
        @setState
          loginTaken: matches.length isnt 0

  handlePasswordChange: ->
    password = @refs.password.getDOMNode().value
    confirmedPassword = @refs.confirmedPassword.getDOMNode().value

    exists = password.length isnt 0
    longEnough = password.length > 5
    asLong = confirmedPassword.length >= password.length
    matches = password is confirmedPassword

    @setState
      passwordTooShort: if exists then not longEnough
      passwordsDontMatch: if exists and asLong then not matches

  isFormValid: ->
    {badLoginChars, loginTaken, passwordsDontMatch} = @state
    agreesToPrivacyPolicy = @refs.agreesToPrivacyPolicy?.getDOMNode().checked

    console.log (badLoginChars?.length is 0), (loginTaken is false), (passwordsDontMatch is false), agreesToPrivacyPolicy
    (badLoginChars?.length is 0) and (loginTaken is false) and (passwordsDontMatch is false) and agreesToPrivacyPolicy

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value
    confirmedPassword = @refs.confirmedPassword.getDOMNode().value
    email = @refs.email.getDOMNode().value
    realName = @refs.realName.getDOMNode().value
    agreesToPrivacyPolicy = @refs.agreesToPrivacyPolicy.getDOMNode().checked

    # TODO:
    # creation = users.create {login, password, confirmedPassword, email, realName, agreesToPrivacyPolicy}
    # creation.then ({errors, user}) ->
    #   loginStore.signIn login, confirmedPassword
