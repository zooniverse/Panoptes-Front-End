{dispatch} = require '../data/dispatcher'

module.exports =
  check: ->
    dispatch 'current-user:check'

  signOut: ->
    dispatch 'current-user:sign-out'

  setPreference: (key, value) ->
    dispatch 'current-user:set-preference', key, value
