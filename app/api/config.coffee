DEFAULT_ENV = 'staging'

API_HOSTS =
  production: 'https://panoptes.zooniverse.org'
  staging: 'https://panoptes-staging.zooniverse.org'
  cam: 'http://172.17.2.87:3000'

API_APPLICATION_IDS =
  production: 'f79cf5ea821bb161d8cbb52d061ab9a2321d7cb169007003af66b43f7b79ce2a'
  staging: '535759b966935c297be11913acee7a9ca17c025f9f15520e7504728e71110a27'
  cam: '535759b966935c297be11913acee7a9ca17c025f9f15520e7504728e71110a27'

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
