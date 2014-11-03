DEFAULT_ENV = 'staging'

API_HOSTS =
  production: '' # Same domain!
  staging: 'https://panoptes-staging.zooniverse.org'
  development: 'http://localhost:3000'
  cam: 'http://172.17.2.87:3000'

API_APPLICATION_IDS =
  staging: '535759b966935c297be11913acee7a9ca17c025f9f15520e7504728e71110a27'
  cam: '05fd85e729327b2f71cda394d8e87e042e0b77b05e05280e8246e8bdb05d54ed'

hostFromBrowser = location?.search.match(/\W?panoptes-api-host=([^&]+)/)?[1]
appFromBrowser = location?.search.match(/\W?panoptes-api-application=([^&]+)/)?[1]

hostFromShell = process.env.PANOPTES_API_HOST
appFromShell = process.env.PANOPTES_API_APPLICATION

envFromBrowser = location?.search.match(/\W?env=(\w+)/)?[1]
envFromShell = process.env.NODE_ENV

env = envFromBrowser ? envFromShell ? DEFAULT_ENV

module.exports =
  host: hostFromBrowser ? hostFromShell ? API_HOSTS[env]
  clientAppID: appFromBrowser ? appFromShell ? API_APPLICATION_IDS[env]
