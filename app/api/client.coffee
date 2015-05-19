JSONAPIClient = {Resource} = require 'json-api-client'
config = require './config'

apiClient = new JSONAPIClient config.host + '/api',
  'Content-Type': 'application/json'
  'Accept': 'application/vnd.api+json; version=1'

apiClient.handleError = (request) ->
  if 'message' of request
    throw request
  else if 'responseText' of request
    response = try JSON.parse request.responseText
    if response?.error?
      errorMessage = response.error
      if response.error_description?
        errorMessage = "#{errorMessage} #{response.error_description}"
    else if response?.errors?[0].message?
      errorMessage = for {message} in response.errors
        if typeof message is 'string'
          message
        else
          ("#{key} #{error}" for key, error of message).join '\n'
      errorMessage = errorMessage.join '\n'

    # Manually set a reasonable error when we get HTML back (currently 500s will do this).
    if request.responseText?.indexOf('<!DOCTYPE') isnt -1
      errorMessage ?= "There was a problem on the server. #{request.responseURL} → #{request.status}"

    errorMessage ?= request.responseText?.trim() || "#{request.status} #{request.statusText}"
    throw new Error errorMessage

module.exports = apiClient
window?.zooAPI = apiClient
