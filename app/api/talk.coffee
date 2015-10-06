JSONAPIClient = {Resource} = require 'json-api-client'
config = require './config'
apiClient = require './client'
authClient = require './auth'

talkClient = new JSONAPIClient config.talkHost,
  'Content-Type': 'application/json'
  'Accept': 'application/json'

authClient.listen 'change', ->
  authClient.checkCurrent()
    .then (user) ->
      if user
        token = authClient._bearerToken
        talkClient.headers['Authorization'] = "Bearer #{token}"
      else
        delete talkClient.headers['Authorization']
    .catch (e) ->
      throw new Error "Failed to checkCurrent auth from talk api client"

# talkClient.headers = apiClient.headers
talkClient.handleError = apiClient.handleError

window?.talkClient = talkClient
module.exports = talkClient
