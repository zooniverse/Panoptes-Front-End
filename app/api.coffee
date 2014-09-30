JSONAPIClient = require 'json-api-client'
{makeHTTPRequest} = JSONAPIClient.util

API_HOSTS =
  production: '' # Same domain!
  staging: 'https://panoptes-staging.zooniverse.org'
  development: 'http://localhost:3000'
  test: 'http://localhost:7357'
  _cam: 'http://172.17.2.87:3000'

DEFAULT_ENV = '_cam'

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

api.client = new JSONAPIClient api.host + '/api',
  'Content-Type': 'application/vnd.api+json; version=1'
  'Accept': 'application/vnd.api+json; version=1'

api.projects = api.client.createType 'projects'

# Proxy the client's HTTP methods to the API object.
for method in ['post', 'get', 'put', 'delete']
  api[method] = api.client[method].bind api.client

api.auth =
  currentToken: ''
  currentSession: null

  getAuthToken: ->
    if @currentToken
      Promise.resolve @currentToken
    else
      makeHTTPRequest('GET', api.host + '/users/sign_up', null, null, ADD_CREDENTIALS).then (request) =>
        [_, authTokenMatch1, authTokenMatch2] = request.responseText.match CSRF_TOKEN_PATTERN
        @currentToken = authTokenMatch1 ? authTokenMatch2
        @currentToken

  register: ({login, email, password, passwordConfirmation}) ->
    api.auth.currentSession = @getAuthToken().then (token) ->
      data =
        authenticity_token: token
        user:
          login: login
          email: email
          password: password
          password_confirmation: passwordConfirmation

      registration = makeHTTPRequest 'POST', api.host + '/users', data, JSON_HEADERS, ADD_CREDENTIALS

      registration.then (response) ->
        console?.log 'Created user', response

      registration

  checkSession: ->
    # TODO

  signIn: ({login, password}) ->
    @getAuthToken().then (token) ->
      data =
        authenticity_token: token
        user:
          login: login
          password: password

      makeHTTPRequest('POST', api.host + '/users/sign_in', data, JSON_HEADERS, ADD_CREDENTIALS).then (response) ->
        console?.log 'Signed in', response
        response

  signOut: ->
    @getAuthToken().then (token) ->
      data =
        authenticity_token: token

      makeHTTPRequest('DELETE', api.host + '/users/sign_out', data, JSON_HEADERS, ADD_CREDENTIALS).then (response) ->
        console?.log 'Signed out'
        response

module.exports = api
window?.api = api
