JSONAPIClient = require 'json-api-client'
{makeHTTPRequest} = JSONAPIClient.util

DEFAULT_ENV = '_cam'

API_HOSTS =
  production: '' # Same domain!
  staging: 'https://panoptes-staging.zooniverse.org'
  development: 'http://localhost:3000'
  test: 'http://localhost:7357'
  _cam: 'http://172.17.2.87:3000'

API_APPLICATION_IDS =
  _cam: '05fd85e729327b2f71cda394d8e87e042e0b77b05e05280e8246e8bdb05d54ed'

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

api = {}

api.host = API_HOSTS[process.env.NODE_ENV ? DEFAULT_ENV]

api.clientAppID = API_APPLICATION_IDS[process.env.NODE_ENV ? DEFAULT_ENV]

api.client = new JSONAPIClient api.host + '/api',
  'Content-Type': 'application/json'
  'Accept': 'application/vnd.api+json; version=1'

api.users = api.client.createType 'users'

# Proxy the client's HTTP methods to the API object.
for method in ['get', 'post', 'put', 'delete']
  api[method] = api.client[method].bind api.client

api.auth =
  currentUser: null
  bearerToken: ''

  getAuthToken: ->
    # if @authToken
    #   Promise.resolve @authToken
    # else
      makeHTTPRequest('GET', api.host + '/', null, 'Accept': 'text/html', ADD_CREDENTIALS).then []...,
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
        client_id: api.clientAppID

      makeHTTPRequest('POST', api.host + '/oauth/token', data, JSON_HEADERS, ADD_CREDENTIALS).then []...,
        (request) =>
          response = JSON.parse request.responseText
          @bearerToken = response.access_token
          api.client.headers['Authorization'] = "Bearer #{@bearerToken}"
          console?.log 'Got bearer token', @bearerToken
          @bearerToken

        (error) =>
          console?.error 'Failed to get bearer token', error

  deleteBearerToken: ->
    @bearerToken = ''
    delete api.client.headers['Authorization']

  register: ({login, email, password, passwordConfirmation}) ->
    @currentUser = @getAuthToken().then (token) ->
      data =
        authenticity_token: token
        user:
          login: login
          email: email
          password: password
          password_confirmation: passwordConfirmation

      makeHTTPRequest('POST', api.host + '/users', data, JSON_HEADERS, ADD_CREDENTIALS).then []...,
        (request) ->
          response = JSON.parse request.responseText
          console?.log 'Created user', response
          response

        (error) ->
          console?.error 'Failed to register', error
          null

  getCurrentUser: ->
    # TODO: Check to see if anybody's signed in.

  signIn: ({login, password}) ->
    @currentUser = @getAuthToken().then (token) =>
      data =
        authenticity_token: token
        user:
          login: login
          password: password

      makeHTTPRequest('POST', api.host + '/users/sign_in', data, JSON_HEADERS, ADD_CREDENTIALS).then []...,
        (request) =>
          console?.log 'Signed in successfully as', login

          # This route returns a JSON-API `users` resource.
          api.client.processResponseTo request

          Promise.all([@getBearerToken(), api.users.get {login}, 1]).then ([token, [user]]) ->
            console?.log 'Current user', user
            user

        (error) ->
          console?.error 'Failed to sign in', error
          null

  signOut: ->
    @getAuthToken().then (token) ->
      data =
        authenticity_token: token

      makeHTTPRequest('DELETE', api.host + '/users/sign_out', data, JSON_HEADERS, ADD_CREDENTIALS).then []...,
        (request) =>
          response = JSON.parse request.responseText
          console?.log 'Signed out', response
          @deleteBearerToken()
          response

        (error) ->
          console?.log 'Failed to sign out', error

module.exports = api
window?.api = api
