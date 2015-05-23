PanoptesClient = require 'panoptes-client'
config = require './config'

{ api } = new PanoptesClient config

module.exports = api
window?.zooAPI = api
