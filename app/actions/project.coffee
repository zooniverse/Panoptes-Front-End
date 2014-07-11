request = require '../lib/request'

projectActions =
  fetch: (name) ->
    request.get "/projects", {name}, ->


module.exports = projectActions
