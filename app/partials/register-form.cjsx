# @cjsx React.DOM

React = require 'react'
InPlaceForm = require '../components/in-place-form'

module.exports = React.createClass
  displayName: 'RegisterForm'

  getInitialState: -> {}

  render: ->
    {badLoginChars, loginTaken, passwordTooShort, passwordsDontMatch} = @state

    <InPlaceForm>
      <div>
        <label>
          <div>Login</div>
          <input type="text" name="login" onChange={@handleLoginChange} ref="login" />
          {if badLoginChars?.length > 0
            <span className="form-help error">Don't use weird characters ({badLoginChars.join ', '}).</span>
          else if loginTaken is true
            <span className="form-help error">Sorry, that login is taken. <a href="#">Forget your password?</a></span>
          else if loginTaken is false
            <span className="form-help success">Looks good.</span>}
        </label>
      </div>
      <br />
      <div>
        <label>
          <div>Password</div>
          <input type="password" name="password" ref="password" onChange={@handlePasswordChange} />
          {if passwordTooShort
            <span className="form-help error">That password is too short. <a href="#">Forget your password?</a></span>}
        </label>
      </div>
      <br />
      <div>
        <label>
          <div>Confirm password</div>
          <input type="password" name="confirmed_password" ref="confirmedPassword" onChange={@handlePasswordChange} />
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
          <input type="text" name="email" />
        </label>
      </div>
      <br />
      <div>
        <label>
          <div>Real name</div>
          <input type="text" name="real_name" />
          <div className="form-help">We'll use this to give you credit in scientific papers, posters, etc.</div>
        </label>
      </div>
      <br />
      <div>
        <label>
          <input type="checkbox" name="agrees_to_privacy_policy" ref="agreesToPrivacyPolicy" onChange={@forceUpdate.bind this, null} />
          You agree to our <a href="#">privacy policy</a> <span className="form-help">(required)</span>.
        </label>
      </div>
      <br />
      <div>
        <button type="submit" disabled={not @isFormValid()}>Register</button>
      </div>
    </InPlaceForm>

  handleLoginChange: ->
    login = @refs.login.getDOMNode().value

    exists = login.length isnt 0
    badChars = (char for char in login.split('') when char isnt encodeURIComponent char)

    @setState
      badLoginChars: badChars
      loginTaken: null

    if badChars.length is 0
      checkTaken = new Promise (resolve) ->
        matches = []
        if Math.random() < 0.5
          matches.push true
        resolve matches

      checkTaken.then (matches) =>
        @setState
          loginTaken: if login then matches.length isnt 0

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
