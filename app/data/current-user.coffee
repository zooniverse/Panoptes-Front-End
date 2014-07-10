Store = require './store'

currentUser = new Store
  current: null

  handlers:
    'current-user:sign-in': (user) ->
      @set 'current', user

    'current-user:sign-out': ->
      @set 'current', null

    'current-user:set': (key, value) ->
      @set "current.#{key}", value

    'current-user:set-preference': (key, value) ->
      @set "current.preferences.#{key}", value

    'current-user:save': (properties...) ->
      dataToSave = {}
      for key in properties
        dataToSave[key] = @current[key]
      console?.log 'PUT', JSON.stringify dataToSave

module.exports = currentUser
