JSONAPIClient = {Resource} = require 'json-api-client'
apiClient = require './client'
authClient = require './auth'

# Staging:
# https://talk-staging.zooniverse.org

# Local:
# http://127.0.0.1:3000

talkClient = new JSONAPIClient 'https://talk-staging.zooniverse.org',
  'Content-Type': 'application/json'
  'Accept': 'application/json'

talkClient.headers = apiClient.headers
talkClient.handleError = apiClient.handleError

window.talkClient = talkClient
module.exports = talkClient
