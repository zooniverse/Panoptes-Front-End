request = require '../lib/request'
{dispatch} = require '../data/dispatcher'

currentUserActions =
  check: ->
    request.get '/me', {token}, (error, {users}) ->
      if users.length is 1
        dispatch 'current-user:sign-in', users[0]

  signIn: (login, password) ->
    request.post '/sessions', {login, password}, (error, {users, tokens, errors}) ->
      if users.length is 1
        request.headers.token = tokens[0]
        dispatch 'current-user:sign-in:succeed', users[0]
      else if errors?
        dispatch 'current-user:sign-in:fail', errors...

  signOut: ->
    dispatch 'current-user:sign-out'

  set: (key, value) ->
    dispatch 'current-user:set', key, value

  save: (properties...) ->
    dispatch 'current-user:save', properties...

module.exports = currentUserActions
