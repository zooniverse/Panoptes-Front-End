Model = require '../lib/model'
makeHTTPRequest = require('json-api-client').util.makeHTTPRequest
config = require './config'
client = require './client'
users = require './users'

JSON_HEADERS =
  'Content-Type': 'application/json'
  'Accept': 'application/json'

# PhantomJS doesn't send any data with DELETE, so fake it here.
DELETE_METHOD_OVERRIDE_HEADERS = Object.create JSON_HEADERS
DELETE_METHOD_OVERRIDE_HEADERS['X-HTTP-Method-Override'] = 'DELETE'

# This will match the CSRF token in a string of HTML.
# TODO: Get JSON instead.
CSRF_TOKEN_PATTERN = do ->
  NAME_ATTR = '''name=['"]csrf-token['"]'''
  CONTENT_ATTR = '''content=['"](.+)['"]'''
  ///#{NAME_ATTR}\s*#{CONTENT_ATTR}|#{CONTENT_ATTR}\s*#{NAME_ATTR}///

module.exports = new Model
  currentUser: null
  bearerToken: ''

  _getAuthToken: ->
    console?.log 'Getting auth token'
    makeHTTPRequest 'GET', config.host + '/', null, 'Accept': 'text/html'
      .then (request) ->
        [_, authTokenMatch1, authTokenMatch2] = request.responseText.match CSRF_TOKEN_PATTERN
        authToken = authTokenMatch1 ? authTokenMatch2
        console?.info 'Got auth token', authToken
        authToken

      .catch (request) ->
        # The back end is down or something.
        try {errors} = JSON.parse request.responseText
        errors ?= [message: password: ['Could not connect to the server']]

        console?.error 'Failed to get auth token', errors
        Promise.reject errors

  _getBearerToken: ->
    console?.log 'Getting bearer token'
    if @bearerToken
      console?.info 'Already had a bearer token', @bearerToken
      Promise.resolve @bearerToken
    else
      data =
        grant_type: 'password'
        client_id: config.clientAppID

      makeHTTPRequest 'POST', config.host + '/oauth/token', data, JSON_HEADERS
        .then (request) =>
          response = JSON.parse request.responseText
          @bearerToken = response.access_token
          client.headers['Authorization'] = "Bearer #{@bearerToken}"
          console?.info 'Got bearer token', @bearerToken
          @bearerToken

        .catch (request) ->
          # You're probably not signed in.
          try {errors} = JSON.parse request.responseText
          console?.error 'Failed to get bearer token', errors
          Promise.reject errors

  _deleteBearerToken: ->
    @bearerToken = ''
    delete client.headers['Authorization']
    console?.log 'Deleted bearer token'

  _getMe: ->
    client.get('/me').then ([user]) =>
      user.listen 'delete', [@, '_handleCurrentUserDeletion', user]
      user

  register: ({login, email, password}) ->
    console?.log 'Registering new account', login
    @update currentUser: @_getAuthToken().then (token) =>
      data =
        authenticity_token: token
        user:
          login: login
          email: email
          password: password

      # This weird URL is actually out of the API, but returns a JSON-API response.
      client.post '/../users', data, JSON_HEADERS
        .then =>
          @_getBearerToken().then =>
            @_getMe().then (user) =>
              console?.info 'Registered account', user.display_name
              user

        .catch ({errors}) ->
          console?.error 'Failed to register', errors
          Promise.reject errors

    @currentUser

  checkCurrent: ->
    console?.log 'Checking for existing session'
    unless @currentUser?
      @update currentUser:
        @_getBearerToken()
          .then =>
            @_getMe().then (user) =>
              console?.info 'Session exists for', user.display_name
              user

          .catch ->
            # If you can't get a bearer token, nobody's signed in. This isn't an error.
            console?.info 'No active session'
            null

    @currentUser

  signIn: ({login, password}) ->
    console?.log 'Signing in', login
    @update currentUser: @_getAuthToken().then (token) =>
      data =
        authenticity_token: token
        user:
          login: login
          password: password

      makeHTTPRequest 'POST', config.host + '/users/sign_in', data, JSON_HEADERS
        .then (request) =>
          # The response contains a JSON-API "users" resource.
          client.processResponseTo request

          @_getBearerToken().then =>
            @_getMe().then (user) =>
              console?.info 'Signed in', user.display_name
              user

        .catch (request) ->
          if request.status in [401, 0] # The server says 401, but the response object says 0, so who knows?
            errors = [message: password: ['Login or password was incorrect']]
          else
            try {errors} = JSON.parse request.responseText

          console?.error 'Failed to sign in', errors
          Promise.reject errors

    @currentUser

  signOut: ->
    console?.log 'Signing out'
    @update currentUser: @_getAuthToken().then (token) =>
      data =
        authenticity_token: token

      makeHTTPRequest 'POST', config.host + '/users/sign_out', data, DELETE_METHOD_OVERRIDE_HEADERS
        .then =>
          @_deleteBearerToken()
          console?.info 'Signed out'
          null

        .catch (request) ->
          try {errors} = JSON.parse request.responseText
          console?.error 'Failed to sign out', errors
          Promise.reject errors

    @currentUser

  _handleCurrentUserDeletion: (user) ->
    console?.log 'Handling account deletion', user.display_name
    user.stopListening 'delete', [@, '_handleCurrentUserDeletion', user]
    @_deleteBearerToken()
    @update currentUser: Promise.resolve null

window?.zooAuth = module.exports

# For quick debugging:
window?.log = console?.info.bind console, 'LOG'
window?.err = console?.error.bind console, 'ERR'
