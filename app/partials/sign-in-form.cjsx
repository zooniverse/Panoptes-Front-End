# @cjsx React.DOM

Translator = require 'react-translator'
React = require 'react'
currentUser = require '../data/current-user'
currentUserActions = require '../actions/current-user'
InPlaceForm = require '../components/in-place-form'

Translator.setStrings
  signIn:
    signIn: 'Sign in'
    signOut: 'Sign out'
    userName: 'User name'
    password: 'Password'
    withFacebook: 'Sign in with Facebook'
    withTwitter: 'Sign in with Twitter'
    withGoogle: 'Sign in with Google'
    errors:
      badCredentials: 'Wrong username or password'
      serverError: 'Something went wrong! Try again later.'

module.exports = React.createClass
  displayName: 'SignInForm'

  componentDidMount: ->
    currentUser.on 'change', this, 'onCurrentUserChange'

  componentWillUnmount: ->
    currentUser.off 'change', this, 'onCurrentUserChange'

  getInitialState: ->
    hasLoginAndPassword: false
    loading: false
    errors: null
    user: null

  onCurrentUserChange: ->
    @setState user: currentUser.current

  handleInputChange: ->
    login = !!@refs.login.getDOMNode().value
    password = !!@refs.password.getDOMNode().value
    @setState hasLoginAndPassword: login and password

  handleSubmit: ->
    login = @refs.login.getDOMNode().value
    password = @refs.password.getDOMNode().value
    signin = currentUserActions.signIn login, password

    @setState loading: true
    signin.then =>
      @setState loading: false

  handleSignOut: ->
    @refs.password.getDOMNode().value = ''
    currentUserActions.signOut()

  render: ->
    <InPlaceForm onSubmit={@handleSubmit}>
      <p>
        <label>
          <Translator>signIn.userName</Translator><br />
          <input type="text" name="login" disabled={@state.user?} onChange={@handleInputChange} autoFocus="autoFocus" ref="login" />
          {if @state.errors?.login
            <span className="error">@state.errors.login</span>
          }
        </label>
      </p>

      <p>
        <label>
          <Translator>signIn.password</Translator><br />
          <input type="password" disabled={@state.user?} onChange={@handleInputChange} ref="password" />
          {if @state.errors?.password
            <span className="error">@state.errors.password</span>
          }
        </label>
      </p>

      <p>
        <button type="submit" disabled={@state.user? or not @state.hasLoginAndPassword}>
          <Translator>signIn.signIn</Translator>
        </button>

        <button type="button" disabled={not @state.user?} onClick={@handleSignOut}>
          <Translator>signIn.signOut</Translator>
        </button>

        {if @state.loading
          <span className="loading">Hold on...</span>
        }
      </p>
    </InPlaceForm>
