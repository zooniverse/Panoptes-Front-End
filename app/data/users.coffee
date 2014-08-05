Store = require './store'

EXAMPLE_USERS =
  'brian-c':
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

  'users:get': (knownProperties, alwaysRequest = false) ->
    getUsers = new Promise (resolve, reject) ->
      setTimeout resolve.bind(null, EXAMPLE_USERS), 1000

    getUsers.then (users) =>
      for login, user of users
        @users[login] = user
