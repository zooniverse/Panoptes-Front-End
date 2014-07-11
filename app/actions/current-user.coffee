request = require '../lib/request'
{dispatch} = require '../data/dispatcher'

currentUserActions =
  check: ->
    request.get '/me', (error, {users}) ->
      if error?
        console?.error error
      else if users.length is 1
        console?.info users[0]
        currentUserActions.succeed users[0]

  signIn: (login, password) ->
    request.get '/sessions', {login, password}, (error, {users, tokens, errors}) ->
      if users.length is 1
        request.headers.token = tokens[0]
        currentUserActions.succeed users[0]
      else if errors?
        currentUserActions.fail errors

  succeed: (user) ->
    dispatch 'current-user:sign-in:succeed', user

  fail: (errors) ->
    dispatch 'current-user:sign-in:fail', errors

  signOut: ->
    dispatch 'current-user:sign-out'

  set: (key, value) ->
    dispatch 'current-user:set', key, value

  save: (properties...) ->
    dispatch 'current-user:save', properties...

module.exports = currentUserActions
