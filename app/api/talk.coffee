JSONAPIClient = {Resource} = require 'json-api-client'
config = require './config'
apiClient = require './client'
authClient = require './auth'

talkClient = new JSONAPIClient config.talkHost,
  'Content-Type': 'application/json'
  'Accept': 'application/json'

talkClient.headers = apiClient.headers
talkClient.handleError = apiClient.handleError

window?.talkClient = talkClient
module.exports = talkClient
