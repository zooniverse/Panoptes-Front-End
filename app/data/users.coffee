Store = require './store'
merge = require 'react/lib/merge'

EXAMPLE_USER =
  id: 'DEV_USER'
  login: 'dev'
  password: 'dev'
  display_name: 'dev'
  real_name: 'Mr. Dev User'
  avatar: 'https://pbs.twimg.com/profile_images/420634335964692480/aXU3vnUq.jpeg'
  email: 'dev-user@zooniverse.org'
  public_email: 'dev-user+spam@zooniverse.org'
  location: 'Dev City'
  bio: '''
    Web developer at the [Zooniverse](/)!
  '''
  pinterest: 'devdevdev'
  twitter: 'zoonidev'
  website: 'https://github.com/brian-c'
  preferences: {}
  can_survey: false
  wants_betas: true
  collections: []
  recents: []
  messages: []
  projects: []
  unseen_events: 4

EXAMPLE_USER_2 = merge EXAMPLE_USER,
  id: 'BRIAN_USER'
  login: 'brian-c'
  password: 'brian-c'
  real_name: 'Brian Carstensen'

module.exports = window.usersStore = new Store
  root: '/users'
  keyedOn: 'login'
  examples: [EXAMPLE_USER, EXAMPLE_USER_2]
