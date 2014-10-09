Model = require '../data/model'
makeHTTPRequest = require('json-api-client').util.makeHTTPRequest
config = require './config'
client = require './client'
users = require './users'

JSON_HEADERS =
  'Content-Type': 'application/json'
  'Accept': 'application/json'

ADD_CREDENTIALS = (request) ->
  request.withCredentials = true

# This will match the CSRF token in a string of HTML.
# TODO: Get JSON instead.
CSRF_TOKEN_PATTERN = do ->
  NAME_ATTR = '''name=['"]csrf-token['"]'''
  CONTENT_ATTR = '''content=['"](.+)['"]'''
  ///#{NAME_ATTR}\s*#{CONTENT_ATTR}|#{CONTENT_ATTR}\s*#{NAME_ATTR}///

module.exports = new Model
  currentUser: null
  bearerToken: ''

  getAuthToken: ->
    makeHTTPRequest 'GET', config.host + '/', null, 'Accept': 'text/html', ADD_CREDENTIALS
      .then (request) ->
        [_, authTokenMatch1, authTokenMatch2] = request.responseText.match CSRF_TOKEN_PATTERN
        authToken = authTokenMatch1 ? authTokenMatch2
        console?.log 'Got auth token', authToken
        authToken

      .catch (request) ->
        try {errors} = JSON.parse request.responseText
        console?.error 'Failed to get auth token', errors
        Promise.reject errors

  getBearerToken: ->
    if @bearerToken
      Promise.resolve @bearerToken
    else
      data =
        grant_type: 'password'
        client_id: config.clientAppID

      makeHTTPRequest 'POST', config.host + '/oauth/token', data, JSON_HEADERS, ADD_CREDENTIALS
        .then (request) =>
          response = JSON.parse request.responseText
          @bearerToken = response.access_token
          client.headers['Authorization'] = "Bearer #{@bearerToken}"
          console?.log 'Got bearer token', @bearerToken
          @bearerToken

        .catch (request) ->
          try {errors} = JSON.parse request.responseText
          console?.error 'Failed to get bearer token', errors
          Promise.reject errors

  deleteBearerToken: ->
    @bearerToken = ''
    delete client.headers['Authorization']

  register: ({login, email, password, passwordConfirmation}) ->
    @getAuthToken().then (token) =>
      data =
        authenticity_token: token
        user:
          login: login
          email: email
          password: password
          # password_confirmation: passwordConfirmation

      makeHTTPRequest 'POST', config.host + '/users', data, JSON_HEADERS, ADD_CREDENTIALS
        .then (request) =>
          # The response contains a JSON-API "users" resource.
          client.processResponseTo request

          @getBearerToken().then =>
            users.get display_name: login, 1
              .then ([user]) =>
                @update currentUser: user
                console?.info 'Registered user', user.display_name
                @currentUser

        .catch (request) ->
          try {errors} = JSON.parse request.responseText
          console?.error 'Failed to register', errors
          Promise.reject errors

  signIn: ({login, password}) ->
    @getAuthToken().then (token) =>
      data =
        authenticity_token: token
        user:
          login: login
          password: password

      makeHTTPRequest 'POST', config.host + '/users/sign_in', data, JSON_HEADERS, ADD_CREDENTIALS
        .then (request) =>
          # The response contains a JSON-API "users" resource.
          client.processResponseTo request

          @getBearerToken().then =>
            users.get display_name: login, 1
              .then ([user]) =>
                @update currentUser: user
                console?.log 'Signed in successfully as', @currentUser.display_name
                @currentUser

        .catch (request) ->
          if request.status in [401, 0] # The server says 401, but the response object says 0, so who knows?
            errors = [message: password: ['Login or password was incorrect']]
          Promise.reject errors

  signOut: ->
    @getAuthToken().then (token) =>
      data =
        authenticity_token: token

      # PhantomJS doesn't send any data with DELETE, so fake it here.
      headers = Object.create JSON_HEADERS
      headers['X-HTTP-Method-Override'] = 'DELETE'

      makeHTTPRequest 'POST', config.host + '/users/sign_out', data, headers, ADD_CREDENTIALS
        .then (request) =>
          @deleteBearerToken()
          @update currentUser: null
          @currentUser

        .catch (request) ->
          try {errors} = JSON.parse request.responseText
          console?.log 'Failed to sign out', errors
          Promise.reject errors

window?.zooAuth = module.exports

# For quick debugging:
window?.log = console?.info.bind console, 'LOG'
window?.err = console?.error.bind console, 'ERR'
