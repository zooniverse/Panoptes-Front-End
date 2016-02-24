apiClient = require 'panoptes-client/lib/api-client'

module.exports = ->
  !!apiClient.params.admin
