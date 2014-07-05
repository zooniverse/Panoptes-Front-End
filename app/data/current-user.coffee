Store = require './store'

currentUser = new Store
  path: '/me'

  current: null

  handlers:
    'current-user:check': ->
      @set 'current', @find 'DEV_USER'

    'current-user:sign-out': ->
      @remove @current
      @set 'current', null

    'current-user:set': (key, value) ->
      @set "current.#{key}", value

    'current-user:set-preference': (key, value) ->
      @set "current.preferences.#{key}", value

    'current-user:save-properties': (properties...) ->
      dataToSave = {}
      for key in properties
        dataToSave[key] = @[key]
      console?.log 'PUT', JSON.stringify dataToSave

currentUser.add
  id: 'DEV_USER'
  login: 'devuser'
  email: 'dev-user@zooniverse.org'
  wants_betas: true
  can_survey: false
  avatar: 'https://pbs.twimg.com/profile_images/420634335964692480/aXU3vnUq.jpeg'
  real_name: 'Mr. Dev User'
  location: 'Dev City'
  public_email: 'dev-user+spam@zooniverse.org'
  personal_url: 'http://www.zooniverse.org/'
  twitter: 'zoonidev'
  pinterest: 'devdevdev'
  preferences: {}

module.exports = currentUser
