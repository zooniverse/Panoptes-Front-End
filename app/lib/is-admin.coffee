apiClient = require '../api/client'

module.exports =  ->
  !!apiClient.params.admin
