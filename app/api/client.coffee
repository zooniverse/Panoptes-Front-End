JSONAPIClient = require 'json-api-client'
config = require './config'

apiClient = new JSONAPIClient config.host + '/api',
  'Content-Type': 'application/json'
  'Accept': 'application/vnd.api+json; version=1'

apiClient.handleError = (request) ->
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

  errorMessage ?= request.responseText || "#{request.status} #{request.statusText}"
  throw new Error errorMessage

module.exports = apiClient
window.zooAPI = apiClient
