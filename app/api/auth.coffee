Model = require '../data/model'
makeHTTPRequest = require('json-api-client').util.makeHTTPRequest
config = require './config'
client = require './client'
users = require './users'

JSON_HEADERS =
  'Content-Type': 'application/json'
  'Accept': 'application/json'

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
        console?.log 'Got auth token', authToken
        authToken

      .catch (request) ->
        # Back end is down or something.
        try {errors} = JSON.parse request.responseText
        errors ?= [message: password: ['Could not connect to the server']]

        console?.error 'Failed to get auth token', errors
        Promise.reject errors

  _getBearerToken: ->
    console?.log 'Getting bearer token'
    if @bearerToken
      console?.log 'Already had a bearer token', @bearerToken
      Promise.resolve @bearerToken
    else
      data =
        grant_type: 'password'
        client_id: config.clientAppID

      console?.log 'Requesting a new bearer token'
      makeHTTPRequest 'POST', config.host + '/oauth/token', data, JSON_HEADERS
        .then (request) =>
          response = JSON.parse request.responseText
          @bearerToken = response.access_token
          client.headers['Authorization'] = "Bearer #{@bearerToken}"
          console?.log 'Got bearer token', @bearerToken
          @bearerToken

        .catch (request) ->
          # You're probably not signed in.
          try {errors} = JSON.parse request.responseText
          console?.error 'Failed to get bearer token', errors
          Promise.reject errors

  _deleteBearerToken: ->
    console?.log 'Deleting bearer token'
    @bearerToken = ''
    delete client.headers['Authorization']

  register: ({login, email, password}) ->
    console?.log 'Registering new account', login
    @update currentUser: @_getAuthToken().then (token) =>
      data =
        authenticity_token: token
        user:
          login: login
          email: email
          password: password

      makeHTTPRequest 'POST', config.host + '/users', data, JSON_HEADERS
        .then (request) =>
          # The response contains a JSON-API "users" resource.
          client.processResponseTo request

          @_getBearerToken().then =>
            # The given login is transformed on the back end, but stored as display_name.
            users.get display_name: login, 1
              .then ([user]) =>
                console?.info 'Registered account', user.display_name
                user

        .catch (request) ->
          try {errors} = JSON.parse request.responseText
          console?.error 'Failed to register', errors
          Promise.reject errors

    @currentUser

  checkCurrent: ->
    console?.log 'Checking for existing session'
    unless @currentUser?
      @update currentUser:
        @_getBearerToken()
          .then =>
            client.get '/me'
              .then ([user]) =>
                console?.log 'Session exists for', user.display_name
                user

          .catch ->
            # If you can't get a bearer token, nobody's signed in.
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
            users.get display_name: login, 1
              .then ([user]) =>
                user
                console?.log 'Signed in', user.display_name
                user

        .catch (request) ->
          if request.status in [401, 0] # The server says 401, but the response object says 0, so who knows?
            errors = [message: password: ['Login or password was incorrect']]
          else
            try {errors} = JSON.parse request.responseText

          Promise.reject errors

    @currentUser

  signOut: ->
    console?.log 'Signing out'
    @update currentUser: @_getAuthToken().then (token) =>
      data =
        authenticity_token: token

      # PhantomJS doesn't send any data with DELETE, so fake it here.
      deleteOverrideJSONHeaders = Object.create JSON_HEADERS
      deleteOverrideJSONHeaders['X-HTTP-Method-Override'] = 'DELETE'

      makeHTTPRequest 'POST', config.host + '/users/sign_out', data, deleteOverrideJSONHeaders
        .then =>
          @_deleteBearerToken()
          null

        .catch (request) ->
          try {errors} = JSON.parse request.responseText
          console?.log 'Failed to sign out', errors
          Promise.reject errors

    @currentUser

window?.zooAuth = module.exports

# For quick debugging:
window?.log = console?.info.bind console, 'LOG'
window?.err = console?.error.bind console, 'ERR'
