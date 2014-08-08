# @cjsx React.DOM

Translator = require 'react-translator'
React = require 'react'
loginStore = require '../data/login'
InPlaceForm = require '../components/in-place-form'
LoadingIndicator = require '../components/loading-indicator'
{dispatch} = require '../lib/dispatcher'

loginFormsIDPool = -1

Translator.setStrings
  signInForm:
    signIn: 'Sign in'
    signOut: 'Sign out'
    userName: 'User name'
    password: 'Password'
    errors:
      BAD_PASSWORD: 'Wrong username or password'
      SERVER_ERROR: 'Something went wrong! Try again later.'

module.exports = React.createClass
  displayName: 'SignInForm'

  mixins: [
    loginStore.mixInto ->
      loading: loginStore.attempts[@props.id]?.loading
      errors: loginStore.attempts[@props.id]?.errors
  ]

  getDefaultProps: ->
    loginFormsIDPool += 1
    id: "login-form-#{loginFormsIDPool}"

  render: ->
    {loading, errors} = @state

    <InPlaceForm onSubmit={@handleSubmit}>
      <div>
        <label>
          <Translator>signInForm.userName</Translator>
          <br />
          <input type="text" name="login" ref="login" autoFocus="autoFocus" />

          {if errors?.login?
            errorString = "signInForm.errors.#{errors.login}"
            <Translator className="form-help error">{errorString}</Translator>}
        </label>
      </div>
      <br />
      <div>
        <label>
          <Translator>signInForm.password</Translator>
          <br />
          <input type="password" name="password" ref="password" />

          {if errors?.password?
            errorString = "signInForm.errors.#{errors.password}"
            <Translator className="form-help error">{errorString}</Translator>}
        </label>
      </div>
      <br />
      <div>
        <button type="submit">
          <Translator>signInForm.signIn</Translator>
        </button>

        {if loading
          <LoadingIndicator />}
      </div>
    </InPlaceForm>

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value
    dispatch 'current-user:sign-in', login, password, @props.id
