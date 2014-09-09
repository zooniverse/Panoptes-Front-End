Store = require './store'
{dispatch} = require '../lib/dispatcher'

EXAMPLE_LOGIN =
  id: 'DEV_USER'
  login: 'dev'
  display_name: 'dev'
  password: 'dev'
  email: 'dev-user@zooniverse.org'
  wants_betas: true
  can_survey: false
  avatar: 'https://pbs.twimg.com/profile_images/420634335964692480/aXU3vnUq.jpeg'
  real_name: 'Mr. Dev User'
  location: 'Dev City'
  public_email: 'dev-user+spam@zooniverse.org'
  personal_url: 'http://www.zooniverse.org/'
  twitter: 'zoonidev'
  pinterest: 'devdevdev'
  preferences: {}
  unseen_events: 4

loginStore = new Store
  loading: false
  current: null

  check: ->
    @loading = true
    @emitChange()

    checkRequest = new Promise (resolve, reject) ->
      # console?.log 'GET /tokens&token=(RANDOM)'
      if Math.random() > 0.5
        currentLogin = EXAMPLE_LOGIN
      setTimeout resolve.bind(null, currentLogin), 1000

    checkRequest.then (user) =>
      @loading = false
      @current = user
      @emitChange()

  signIn: (login, password) ->
    console.log 'Sign in started', {login}, {password}
    console.log 'Set loginStore loading'
    @loading = true
    @emitChange()

    console?.log "GET /tokens?login=#{login}&password=#{password}"
    loginRequest = new Promise (resolve, reject) ->
      if login is EXAMPLE_LOGIN.login and password is EXAMPLE_LOGIN.password
        user = EXAMPLE_LOGIN
      else
        errors = password: 'BAD_PASSWORD'

      console.log 'Will resolve with', {user}, {errors}
      setTimeout resolve.bind(null, {user, errors}), 1000

    loginRequest.then ({user, errors}) =>
      console.log 'Resolved with', {user}, {errors}
      console.log 'loginStore no longer loading'
      @loading = false
      @current = user
      @emitChange()

    loginRequest

  'current-user:sign-out': ->
    console?.log 'DELETE /tokens/(TOKEN_ID)'
    @current = null

  'current-user:set': (key, value) ->
    @current[key] = value

  'current-user:set-preference': (key, value) ->
    @current.preferences[key] = value

  'current-user:save': (properties...) ->
    if properties.length is 0
      console?.log 'PUT', JSON.stringify @current

    else
      dataToSave = {}
      for key in properties
        dataToSave[key] = @current[key]
      console?.log 'PATCH', JSON.stringify dataToSave

module.exports = loginStore
