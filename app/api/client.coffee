JSONAPIClient = {Resource} = require 'json-api-client'
config = require './config'

apiClient = new JSONAPIClient config.host + '/api',
  'Content-Type': 'application/json'
  'Accept': 'application/vnd.api+json; version=1'

apiClient.handleError = (response) ->
  responseText = try JSON.parse response.text

  if responseText?.error?
    errorMessage = responseText.error
    if responseText.error_description?
      errorMessage = "#{errorMessage} #{response.error_description}"
  else if responseText?.errors?[0].message?
    errorMessage = for {message} in responseText.errors
      if typeof message is 'string'
        message
      else
        ("#{key} #{error}" for key, error of message).join '\n'
    errorMessage = errorMessage.join '\n'

  # Manually set a reasonable error when we get HTML back (currently 500s will do this).
  if response.text?.indexOf('<!DOCTYPE') isnt -1
    errorMessage ?= "There was a problem on the server. #{response.error?.url} → #{response.status}"

  errorMessage ?= response.responseText?.trim() || "#{response.status} #{response.statusText}"
  throw new Error errorMessage

module.exports = apiClient
window?.zooAPI = apiClient
