Store = require './store'
Auth = require '../api/auth'
auth = new Auth()

loginStore = new Store
  loading: false
  currentUser: null
  errors: null

  'current-user:check': ->
    console.log 'Checking current user'
    @loading = true
    @emitChange()

    auth.checkCurrent().then (@currentUser) =>
      console.log 'Current user is ', @currentUser
      @loading = false
      @errors = null
      @emitChange()
    .catch (@errors) =>
      console.log 'Caught errors ', @errors
      @loading = false
      @emitChange()

  'current-user:sign-in': ({ login, password }) ->
    console.log 'Sign in with ', { login, password }
    @loading = true
    @emitChange()
    auth.signIn({ login, password }).then (@currentUser) =>
      console.log 'Signed in as ', @currentUser
      @loading = false
      @errors = null
      @emitChange()
    .catch (@errors) =>
      console.log 'Caught errors ', @errors
      @loading = false
      @emitChange()

  'current-user:sign-up': ({ login, password, email, realName }) ->
    console.log 'Sign up with ', {login, password, email, realName}
    @loading = true
    @emitChange()
    auth.register({login, password, email, realName}).then (@currentUser) =>
      console.log 'Signed up as ', @currentUser
      @loading = false
      @errors = null
      @emitChange()
    .catch (@errors) =>
      console.log 'Caught errors ', @errors
      @loading = false
      @emitChange()

  'current-user:sign-out': ->
    console.log 'Sign Out'
    @loading = true
    @emitChange()
    auth.signOut().then =>
      console.log 'Signed out'
      @currentUser = null
      @loading = false
      @errors = null
      @emitChange()
    .catch (@errors) =>
      console.log 'Caught errors ', @errors
      @loading = false
      @emitChange()

  'current-user:set': (key, value) ->
    @currentUser[key] = value

  'current-user:set-preference': (key, value) ->
    @currentUser.preferences[key] = value

  'current-user:save': (properties...) ->
    if properties.length is 0
      console?.log 'PUT', JSON.stringify @currentUser

    else
      dataToSave = {}
      for key in properties
        dataToSave[key] = @currentUser[key]
      console?.log 'PATCH', JSON.stringify dataToSave

module.exports = loginStore
