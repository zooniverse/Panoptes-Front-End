request = require 'superagent'

module.exports =
  prefix: '/api'
  token: ''

  signInNormally: (username, password) ->
    request.get '/token'

  get: () ->
