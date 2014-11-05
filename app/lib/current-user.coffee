auth = require '../api/auth'
promiseToSetState = require '../lib/promise-to-set-state'
signUpErrorParser = require '../lib/sign-up-errors'

module.exports =
  mixins: [promiseToSetState]

  getInitialState: ->
    signInErrors: { }, signUpErrors: { }

  componentDidMount: ->
    @handleAuthChange()
    auth.listen @handleAuthChange

  componentWillUnmount: ->
    auth.stopListening @handleAuthChange

  handleAuthChange: ->
    @promiseToSetState currentUser: auth.checkCurrent()

  isSignedIn: ->
    @state.currentUser and
      not @state.hasSignInErrors and
      not @state.hasSignUpErrors and
      not @state.currentUserLoading

  isDisabled: ->
    @state.currentUserLoading or @isSignedIn()

  handleSignIn: ({ login, password }) ->
    @setState currentUserLoading: true
    auth.signIn { login, password }
      .then =>
        @setState hasSignInErrors: false, signInErrors: { }, currentUserLoading: false
      .catch (errors) =>
        errors = Object.assign { }, @state.signInErrors, errors
        @setState hasSignInErrors: true, signInErrors: errors, currentUserLoading: false

  handleSignUp: ({ login, password, email, realName }) ->
    @setState currentUserLoading: true
    auth.register { login, password, email, realName }
      .then =>
        @setState hasSignUpErrors: false, signUpErrors: { }, currentUserLoading: false
      .catch (errors) =>
        errors = Object.assign { }, @state.signUpErrors, signUpErrorParser.parse(errors)
        @setState hasSignUpErrors: true, signUpErrors: errors, currentUserLoading: false

  handleSignOut: ->
    @setState currentUserLoading: true
    auth.signOut().then =>
      @setState currentUserLoading: false
