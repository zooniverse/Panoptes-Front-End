DEFAULT_ENV = '_cam'

API_HOSTS =
  production: '' # Same domain!
  staging: 'https://panoptes-staging.zooniverse.org'
  development: 'http://localhost:3000'
  test: 'http://localhost:7357'
  _cam: 'http://172.17.2.87:3000'

API_APPLICATION_IDS =
  _cam: '05fd85e729327b2f71cda394d8e87e042e0b77b05e05280e8246e8bdb05d54ed'

module.exports =
  host: API_HOSTS[process.env.NODE_ENV ? DEFAULT_ENV]
  clientAppID: API_APPLICATION_IDS[process.env.NODE_ENV ? DEFAULT_ENV]
