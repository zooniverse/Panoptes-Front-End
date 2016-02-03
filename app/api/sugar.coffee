JSONAPIClient = {Resource} = require 'json-api-client'
authClient = require './auth'
config = require './config'
SugarClient = require 'sugar-client'

if window.navigator?
  SugarClient.Primus = require 'sugar-client/primus'
  SugarClient.host = config.sugarHost

  window.sugarApiClient = new JSONAPIClient config.sugarHost,
    'Content-Type': 'application/json'
    'Accept': 'application/json'

  window.sugarClient = new SugarClient()

  authClient.listen 'change', ->
    authClient.checkCurrent()
      .then (user) ->
        if user and authClient._bearerToken
          sugarClient.userId = user.id
          sugarClient.authToken = authClient._bearerToken

          if process.env.NODE_ENV isnt 'production'
            sugarClient.on 'response', (args...) ->
              console.log '[SUGAR RESPONSE] ', args...

          sugarClient.connect()
        else
          window?.sugarClient?.disconnect()
      .catch (e) ->
        throw new Error "Failed to checkCurrent auth from sugar client"

  module.exports = {sugarClient, sugarApiClient}
else
  module.exports = {}
