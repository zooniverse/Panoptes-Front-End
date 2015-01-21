Model = require '../lib/model'
makeHTTPRequest = require('json-api-client').util.makeHTTPRequest
config = require './config'
client = require './client'

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
  _currentUser: null
  _bearerToken: ''

  _getAuthToken: ->
    console?.log 'Getting auth token'
    makeHTTPRequest 'GET', config.host + '/', null, 'Accept': 'text/html'
      .then (request) ->
        [_, authTokenMatch1, authTokenMatch2] = request.responseText.match CSRF_TOKEN_PATTERN
        authToken = authTokenMatch1 ? authTokenMatch2
        console?.info 'Got auth token', authToken
        authToken

      .catch (request) ->
        console?.error 'Failed to get auth token'
        client.handleError request

  _getBearerToken: ->
    console?.log 'Getting bearer token'
    if @_bearerToken
      console?.info 'Already had a bearer token', @_bearerToken
      Promise.resolve @_bearerToken
    else
      data =
        grant_type: 'password'
        client_id: config.clientAppID

      makeHTTPRequest 'POST', config.host + '/oauth/token', data, JSON_HEADERS
        .then (request) =>
          response = JSON.parse request.responseText
          @_bearerToken = response.access_token
          client.headers['Authorization'] = "Bearer #{@_bearerToken}"
          console?.info 'Got bearer token', @_bearerToken
          @_bearerToken

        .catch (request) ->
          # You're probably not signed in.
          console?.error 'Failed to get bearer token'
          client.handleError request

  _deleteBearerToken: ->
    @_bearerToken = ''
    delete client.headers['Authorization']
    console?.log 'Deleted bearer token'

  _getSession: ->
    console?.log 'Getting session'
    client.get '/me'
      .then ([user]) =>
        console?.info 'Got session', user.display_name, user.id
        user.listen 'delete', [@, '_handleCurrentUserDeletion', user]
        user

      .catch (error) ->
        console?.error 'Failed to get session'
        throw error

  register: ({login, email, password}) ->
    @checkCurrent().then (user) =>
      if user?
        @signOut().then =>
          @register {login, email, password}
      else
        console?.log 'Registering new account', login

        registrationRequest = @_getAuthToken().then (token) =>
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
                @_getSession().then (user) =>
                  console?.info 'Registered account', user.display_name, user.id
                  user

            .catch (error) ->
              console?.error 'Failed to register'
              throw error

        @update _currentUser: registrationRequest.catch =>
          null

        registrationRequest

  checkCurrent: ->
    unless @_currentUser?
      console?.log 'Checking current user'
      @update _currentUser:
        @_getBearerToken()
          .then =>
            @_getSession()

          .catch ->
            # Nobody's signed in. This isn't an error.
            console?.info 'No current user'
            null

    @_currentUser

  signIn: ({login, password}) ->
    @checkCurrent().then (user) =>
      if user?
        @signOut().then =>
          @signIn {login, password}
      else
        console?.log 'Signing in', login

        signInRequest = @_getAuthToken().then (token) =>
          data =
            authenticity_token: token
            user:
              login: login
              password: password

          makeHTTPRequest 'POST', config.host + '/users/sign_in', data, JSON_HEADERS
            .then =>
              @_getBearerToken().then =>
                @_getSession().then (user) =>
                  console?.info 'Signed in', user.display_name, user.id
                  user

            .catch (request) ->
              console?.error 'Failed to sign in'
              client.handleError request

        @update _currentUser: signInRequest.catch =>
          null

        signInRequest

  signOut: ->
    @checkCurrent().then (user) =>
      if user?
        console?.log 'Signing out'

        @_getAuthToken().then (token) =>
          data =
            authenticity_token: token

          makeHTTPRequest 'POST', config.host + '/users/sign_out', data, DELETE_METHOD_OVERRIDE_HEADERS
            .then =>
              @_deleteBearerToken()
              console?.info 'Signed out'
              @update _currentUser: Promise.resolve null
              null

            .catch (request) ->
              console?.error 'Failed to sign out'
              client.handleError request
      else
        null

  _handleCurrentUserDeletion: (user) ->
    console?.log 'Handling account deletion', user.display_name, user.id
    user.stopListening 'delete', [@, '_handleCurrentUserDeletion', user]
    @_deleteBearerToken()
    @update _currentUser: Promise.resolve null

# For quick debugging:
window?.zooAuth = module.exports
window?.log = console?.info.bind console, 'LOG'
window?.err = console?.error.bind console, 'ERR'
