Store = require './store'

EXAMPLE_USER =
  id: 'DEV_USER'
  login: 'brian-c'
  display_name: 'brian-c'
  password: 'password'
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
  unseen_events: 4

currentUser = new Store
  loading: true
  errors: null
  current: null

  'current-user:check': ->
    # TODO: Request `/me` or whatever.
    setTimeout @set.bind(this, 'current', EXAMPLE_USER), 1000

  'current-user:sign-in:succeed': ->
    setTimeout @set.bind(this, 'current', EXAMPLE_USER), 1000

  'current-user:sign-in:fail': ->
    @set 'current', null

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
