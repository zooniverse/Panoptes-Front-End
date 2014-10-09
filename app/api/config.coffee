DEFAULT_ENV = 'staging'

API_HOSTS =
  production: '' # Same domain!
  staging: 'https://panoptes-staging.zooniverse.org'
  development: 'http://localhost:3000'
  test: 'http://localhost:7357'
  cam: 'http://172.17.2.87:3000'

API_APPLICATION_IDS =
  staging: '535759b966935c297be11913acee7a9ca17c025f9f15520e7504728e71110a27'
  cam: '05fd85e729327b2f71cda394d8e87e042e0b77b05e05280e8246e8bdb05d54ed'

BROWSER_ENV_PARAM = location?.search.match(/\W?env=(\w+)/)?[1]

env = BROWSER_ENV_PARAM ? process.env.NODE_ENV ? DEFAULT_ENV

module.exports =
  host: API_HOSTS[env]
  clientAppID: API_APPLICATION_IDS[env]
