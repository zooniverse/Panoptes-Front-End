{dispatch} = require '../data/dispatcher'

module.exports =
  check: ->
    setTimeout () ->
      dispatch 'current-user:check'

  signIn: (login, password) ->
    dispatch 'current-user:sign-in'

  signOut: ->
    dispatch 'current-user:sign-out'

  setPreference: (key, value) ->
    dispatch 'current-user:set-preference', key, value
