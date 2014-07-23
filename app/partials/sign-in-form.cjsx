# @cjsx React.DOM

Translator = require 'react-translator'
React = require 'react'
currentUser = require '../data/current-user'
currentUserActions = require '../actions/current-user'
InPlaceForm = require '../components/in-place-form'

Translator.setStrings
  signInForm:
    signIn: 'Sign in'
    signOut: 'Sign out'
    userName: 'User name'
    password: 'Password'
    errors:
      badCredentials: 'Wrong username or password'
      serverError: 'Something went wrong! Try again later.'

module.exports = React.createClass
  displayName: 'SignInForm'

  getInitialState: ->
    hasLoginAndPassword: false
    loading: false
    errors: null

  handleInputChange: ->
    login = !!@refs.login.getDOMNode().value
    password = !!@refs.password.getDOMNode().value
    @setState hasLoginAndPassword: login and password

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value
    currentUserActions.signIn login, password
    @setState loading: true

  handleSignOut: ->
    @refs.password.getDOMNode().value = ''
    currentUserActions.signOut()

  onCurrentUserChange: ->
    @setState
      loading: false

  render: ->
    @transferPropsTo <InPlaceForm onSubmit={@handleSubmit}>
      <p>
        <label>
          <Translator>signInForm.userName</Translator><br />
          <input type="text" name="login" disabled={@props.user?} onChange={@handleInputChange} autoFocus="autoFocus" ref="login" />
          {if @state.errors?.login
            <span className="error">@state.errors.login</span>
          }
        </label>
      </p>

      <p>
        <label>
          <Translator>signInForm.password</Translator><br />
          <input type="password" disabled={@props.user?} onChange={@handleInputChange} ref="password" />
          {if @state.errors?.password
            <span className="error">@state.errors.password</span>
          }
        </label>
      </p>

      <p>
        <button type="submit" disabled={@state.loading or @props.user? or not @state.hasLoginAndPassword}>
          <Translator>signInForm.signIn</Translator>
        </button>

        <button type="button" disabled={not @props.user?} onClick={@handleSignOut}>
          <Translator>signInForm.signOut</Translator>
        </button>

        {if @state.loading
          <span className="loading">Hold on...</span>
        }
      </p>
    </InPlaceForm>
