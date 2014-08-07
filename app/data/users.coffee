Store = require './store'

EXAMPLE_USER =
  id: 'USER_BC'
  login: 'brian-c'
  display_name: 'brian-c'
  avatar: 'https://pbs.twimg.com/profile_images/420634335964692480/aXU3vnUq.jpeg'
  credited_name: 'Brian Carstensen'
  location: 'Chicago, IL'
  twitter: '__brian_c__'
  website: 'https://github.com/brian-c'
  bio: '''
    Web developer at the [Zooniverse](/)!
  '''
  projects: []
  recents: []
  collections: []
  messages: []

module.exports = new Store
  users: {}

  'users:get': (knownProperties) ->
    getUsers = new Promise (resolve, reject) ->
      setTimeout resolve.bind(null, [EXAMPLE_USER]), 1000

    getUsers.then (users) =>
      console.log 'USERS:GET', arguments
      for user in users
        @users[user.login] = user
