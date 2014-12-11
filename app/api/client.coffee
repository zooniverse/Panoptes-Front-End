JSONAPIClient = require 'json-api-client'
config = require './config'

module.exports = new JSONAPIClient config.host + '/api',
  'Content-Type': 'application/json'
  'Accept': 'application/vnd.api+json; version=1'

window.zooAPI = module.exports