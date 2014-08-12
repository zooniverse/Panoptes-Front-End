Store = require './store'
{dispatch} = require '../lib/dispatcher'

EXAMPLE_USER =
  id: 'USER_BC'
  login: 'brian-c'
  display_name: 'brian-c'
  avatar: 'https://pbs.twimg.com/profile_images/420634335964692480/aXU3vnUq.jpeg'
  credited_name: 'Brian Carstensen'
  location: 'Chicago, IL'
  website: 'https://github.com/brian-c'
  twitter: '__brian_c__'
  bio: '''
    Web developer at the [Zooniverse](/)!
  '''
  projects: []
  recents: []
  collections: []
  messages: []

module.exports = window.usersStore = new Store
  root: '/users'
  keyedOn: 'login'
  examples: [EXAMPLE_USER]
