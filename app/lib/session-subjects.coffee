auth = require '../api/auth'

module.exports = []

auth.listen 'change', ->
  module.exports.splice 0
