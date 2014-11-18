auth = require '../api/auth'
promisedState = require '../lib/promised-state'
signUpErrorParser = require '../lib/sign-up-errors'

module.exports =
  mixins: [promisedState]

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
    auth.signIn { login, password }
      .then =>
        @setState hasSignInErrors: false, signInErrors: { }
      .catch (errors) =>
        errors = Object.assign { }, @state.signInErrors, errors
        @setState hasSignInErrors: true, signInErrors: errors

  handleSignUp: ({ login, password, email, realName }) ->
    auth.register { login, password, email, realName }
      .then =>
        @setState hasSignUpErrors: false, signUpErrors: { }
      .catch (errors) =>
        errors = Object.assign { }, @state.signUpErrors, signUpErrorParser.parse(errors)
        @setState hasSignUpErrors: true, signUpErrors: errors

  handleSignOut: ->
    auth.signOut()
