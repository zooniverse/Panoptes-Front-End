JSONAPIClient = {Resource} = require 'json-api-client'
authClient = require './auth'
config = require './config'

SugarClient = require 'sugar-client'
SugarClient.Primus = require 'sugar-client/primus'
SugarClient.host = config.sugarHost

sugarApiClient = new JSONAPIClient config.sugarHost,
  'Content-Type': 'application/json'
  'Accept': 'application/json'

window.sugarClient = new SugarClient()

authClient.listen 'change', ->
  authClient.checkCurrent()
    .then (user) ->
      if user and authClient._bearerToken
        window.sugarClient.userId = user.id
        window.sugarClient.authToken = authClient._bearerToken

        if config.isDevelopment
          sugarClient.on 'response', (args...) ->
            console.log '[SUGAR RESPONSE] ', args...

        sugarClient.connect()
      else
        window.sugarClient?.disconnect()
    .catch (e) ->
      throw new Error "Failed to checkCurrent auth from sugar client"

module.exports = window.sugarApiClient = sugarApiClient
