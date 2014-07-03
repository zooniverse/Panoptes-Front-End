Store = require './store'

currentUser = new Store
  path: '/me'

  current: null

  handlers:
    'current-user:check': ->
      setTimeout =>
        @set 'current', @filter(({id}) -> id is 'DEV_USER').DEV_USER

    'current-user:sign-out': ->
      @set 'current', null

    'current-user:set-preference': (key, value) ->
      console.log 'Setting pref', key, value
      @set "current.preferences.#{key}", value

currentUser.add
  id: 'DEV_USER'
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

window.cu = currentUser
module.exports = currentUser
