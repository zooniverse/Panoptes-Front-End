appActions = require './app'
{dispatch} = require '../data/dispatcher'

currentUserActions =
  check: ->
    dispatch 'current-user:check'

  signIn: (login, password) ->
    dispatch 'current-user:sign-in', user

  succeed: (user) ->
    dispatch 'current-user:sign-in:succeed', user
    dispatch 'login-dialog:hide'

  fail: (errors) ->
    dispatch 'current-user:sign-in:fail', errors

  signOut: ->
    dispatch 'current-user:sign-out'

  set: (key, value) ->
    dispatch 'current-user:set', key, value

  save: (properties...) ->
    dispatch 'current-user:save', properties...

module.exports = currentUserActions
