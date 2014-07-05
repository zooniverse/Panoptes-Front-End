{dispatch} = require '../data/dispatcher'

module.exports =
  check: ->
    setTimeout ->
      dispatch 'current-user:check'

  signIn: (login, password) ->
    dispatch 'current-user:sign-in'

  signOut: ->
    dispatch 'current-user:sign-out'

  set: (key, value) ->
    dispatch 'current-user:set', key, value

  setPreference: (key, value) ->
    dispatch 'current-user:set-preference', key, value

  save: (properties...) ->
    dispatch 'current-user:save-properies', properties...
