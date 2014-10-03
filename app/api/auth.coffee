Model = require '../data/model'
makeHTTPRequest = require('json-api-client').util.makeHTTPRequest
config = require './config'
client = require './client'
users = require './users'

JSON_HEADERS =
  'Accept': 'application/json'
  'Content-Type': 'application/json'

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
    # if @authToken
    #   Promise.resolve @authToken
    # else
      makeHTTPRequest('GET', config.host + '/', null, 'Accept': 'text/html', ADD_CREDENTIALS).then []...,
        (request) ->
          [_, authTokenMatch1, authTokenMatch2] = request.responseText.match CSRF_TOKEN_PATTERN
          authToken = authTokenMatch1 ? authTokenMatch2
          console?.log 'Got auth token', authToken
          authToken

        (error) ->
          console?.error 'Failed to get auth token', error

  getBearerToken: ->
    if @bearerToken
      Promise.resolve @bearerToken
    else
      data =
        grant_type: 'password'
        client_id: config.clientAppID

      makeHTTPRequest('POST', config.host + '/oauth/token', data, JSON_HEADERS, ADD_CREDENTIALS).then []...,
        (request) =>
          response = JSON.parse request.responseText
          @bearerToken = response.access_token
          client.headers['Authorization'] = "Bearer #{@bearerToken}"
          console?.log 'Got bearer token', @bearerToken
          @bearerToken

        (error) =>
          console?.error 'Failed to get bearer token', error

  deleteBearerToken: ->
    @bearerToken = ''
    delete client.headers['Authorization']

  register: ({login, email, password, passwordConfirmation}) ->
    @update currentUser: @getAuthToken().then (token) ->
      data =
        authenticity_token: token
        user:
          login: login
          email: email
          password: password
          password_confirmation: passwordConfirmation

      makeHTTPRequest('POST', config.host + '/users', data, JSON_HEADERS, ADD_CREDENTIALS).then []...,
        (request) ->
          response = JSON.parse request.responseText
          console?.log 'Created user', response
          response

        (error) ->
          console?.error 'Failed to register', error
          null

  signIn: ({login, password}) ->
    @getAuthToken().then (token) =>
      data =
        authenticity_token: token
        user:
          login: login
          password: password

      makeHTTPRequest('POST', config.host + '/users/sign_in', data, JSON_HEADERS, ADD_CREDENTIALS).then []...,
        (request) =>
          console?.log 'Signed in successfully as', login

          # This route returns a JSON-API `users` resource.
          client.processResponseTo request

          Promise.all([@getBearerToken(), users.get {login}, 1]).then ([token, [user]]) =>
            console?.log 'Current user', user
            @update currentUser: user

        (error) ->
          console?.error 'Failed to sign in', error
          error

  signOut: ->
    @getAuthToken().then (token) ->
      data =
        authenticity_token: token

      makeHTTPRequest('DELETE', config.host + '/users/sign_out', data, JSON_HEADERS, ADD_CREDENTIALS).then []...,
        (request) =>
          response = JSON.parse request.responseText
          console?.log 'Signed out', response
          @deleteBearerToken()
          response

        (error) ->
          console?.log 'Failed to sign out', error

window.zooAuth = module.exports
