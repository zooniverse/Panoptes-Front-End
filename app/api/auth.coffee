{Model, makeHTTPRequest} = require 'json-api-client'
config = require './config'
client = require './client'

# Use this to override the default API-specific headers.
JSON_HEADERS =
  'Content-Type': 'application/json'
  'Accept': 'application/json'

# We don't want to wait until the token is already expired before refreshing it.
TOKEN_EXPIRATION_ALLOWANCE = 10 * 1000

module.exports = new Model
  _currentUserPromise: null
  _bearerToken: ''
  _bearerRefreshTimeout: NaN

  _getAuthToken: ->
    console?.log 'Getting auth token'
    makeHTTPRequest 'GET', config.host + "/users/sign_in/?now=#{Date.now()}", null, JSON_HEADERS
      .then (request) ->
        authToken = request.getResponseHeader 'X-CSRF-Token'
        console?.info "Got auth token #{authToken[...6]}..."
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
          token = @_handleNewBearerToken request
          console?.info "Got bearer token #{token[...6]}..."

        .catch (request) ->
          # You're probably not signed in.
          console?.error 'Failed to get bearer token'
          client.handleError request

  _handleNewBearerToken: (request) ->
    response = JSON.parse request.responseText

    @_bearerToken = response.access_token
    client.headers['Authorization'] = "Bearer #{@_bearerToken}"

    refresh = @_refreshBearerToken.bind this, response.refresh_token
    timeToRefresh = (response.expires_in * 1000) - TOKEN_EXPIRATION_ALLOWANCE
    @_bearerRefreshTimeout = setTimeout refresh, timeToRefresh

    @_bearerToken

  _refreshBearerToken: (refreshToken) ->
    data =
      grant_type: 'refresh_token'
      refresh_token: refreshToken
      client_id: config.clientAppID

    makeHTTPRequest 'POST', config.host + '/oauth/token', data, JSON_HEADERS
      .then (request) =>
        token = @_handleNewBearerToken request
        console?.info "Refreshed bearer token #{token[...6]}..."

      .catch (request) ->
        console?.error 'Failed to refresh bearer token'
        client.handleError request

  _deleteBearerToken: ->
    @_bearerToken = ''
    delete client.headers['Authorization']
    clearTimeout @_bearerRefreshTimeout
    console?.log 'Deleted bearer token'

  _getSession: ->
    console?.log 'Getting session'
    client.get '/me'
      .then ([user]) =>
        console?.info 'Got session', user.login, user.id
        user

      .catch (error) ->
        console?.error 'Failed to get session'
        throw error

  register: ({login, email, password, credited_name, global_email_communication, project_id, beta_email_communication, project_email_communication}) ->
    @checkCurrent().then (user) =>
      if user?
        @signOut().then =>
          @register {login, email, password}
      else
        console?.log 'Registering new account', login

        registrationRequest = @_getAuthToken().then (token) =>
          data =
            authenticity_token: token
            user: {login, email, password, credited_name, global_email_communication, project_id, beta_email_communication, project_email_communication}

          # This weird URL is actually out of the API, but returns a JSON-API response.
          client.post '/../users', data, JSON_HEADERS
            .then =>
              @_getBearerToken().then =>
                @_getSession().then (user) =>
                  console?.info 'Registered account', user.login, user.id
                  user

            .catch (error) ->
              console?.error 'Failed to register'
              throw error

        @update _currentUserPromise: registrationRequest.catch =>
          null

        registrationRequest

  checkCurrent: ->
    unless @_currentUserPromise?
      console?.log 'Checking current user'
      @update _currentUserPromise:
        @_getBearerToken()
          .then =>
            @_getSession()

          .catch ->
            # Nobody's signed in. This isn't an error.
            console?.info 'No current user'
            null

    @_currentUserPromise

  signIn: ({login, password}) ->
    @checkCurrent().then (user) =>
      remember_me = true
      if user?
        @signOut().then =>
          @signIn {login, password, remember_me}
      else
        console?.log 'Signing in', login

        signInRequest = @_getAuthToken().then (token) =>
          data =
            authenticity_token: token
            user: {login, password, remember_me}

          makeHTTPRequest 'POST', config.host + '/users/sign_in', data, JSON_HEADERS
            .then =>
              @_getBearerToken().then =>
                @_getSession().then (user) =>
                  console?.info 'Signed in', user.login, user.id
                  user

            .catch (request) ->
              console?.error 'Failed to sign in'
              client.handleError request

        @update _currentUserPromise: signInRequest.catch =>
          null

        signInRequest

  changePassword: ({current, replacement}) ->
    @checkCurrent().then (user) =>
      if user?
        @_getAuthToken().then (token) =>
          data =
            authenticity_token: token
            user:
              current_password: current
              password: replacement
              password_confirmation: replacement

          client.put '/../users', data, JSON_HEADERS
            .then =>
              @signOut() # Rough, but it'll do for now. Without signing out and back in, the session is lost.
            .then =>
              {login} = user
              password = replacement
              @signIn {login, password}

      else
        throw new Error 'No signed-in user to change the password for'

  requestPasswordReset: ({email}) ->
    @_getAuthToken().then (token) =>
      data =
        authenticity_token: token
        user: {email}

      client.post '/../users/password', data, JSON_HEADERS

  resetPassword: ({password, confirmation, token: resetToken}) ->
    @_getAuthToken().then (authToken) =>
      data =
        authenticity_token: authToken
        user:
          password: password
          password_confirmation: confirmation
          reset_password_token: resetToken

      client.put '/../users/password', data, JSON_HEADERS

  disableAccount: ->
    console?.log 'Disabling account'
    @checkCurrent().then (user) =>
      if user?
        user.delete().then =>
          @_deleteBearerToken()
          @update _currentUserPromise: Promise.resolve null
          console?.info 'Disabled account'
          null
      else
        throw new Error 'Failed to disable account; not signed in'

  signOut: ->
    console?.log 'Signing out'
    @checkCurrent().then (user) =>
      if user?
        @_getAuthToken().then (token) =>

          deleteHeaders = Object.create JSON_HEADERS
          deleteHeaders["X-CSRF-Token"] = token

          makeHTTPRequest 'DELETE', config.host + '/users/sign_out', null, deleteHeaders
            .then =>
              @_deleteBearerToken()
              @update _currentUserPromise: Promise.resolve null
              console?.info 'Signed out'
              null

            .catch (request) ->
              console?.error 'Failed to sign out'
              client.handleError request
      else
        throw new Error 'Failed to sign out; not signed in'

  unsubscribeEmail: ({email}) ->
    @_getAuthToken().then (token) =>
      data =
        authenticity_token: token
        email: email

      makeHTTPRequest 'POST', config.host + '/unsubscribe', data, JSON_HEADERS

# For quick debugging:
window?.zooAuth = module.exports
window?.log = console?.info.bind console, 'LOG'
window?.err = console?.error.bind console, 'ERR'
