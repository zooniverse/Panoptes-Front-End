RouteParser = require 'route-parser'

a = document.createElement 'a'

module.exports =
  parseLocation: ->
    a.href = location.hash.slice 1

    query = {}
    for keyAndValue in a.search.slice(1).split '&'
      [key, value] = keyAndValue.split '='
      query[key] = value

    path: a.pathname
    hash: a.hash.slice 1
    query: query

  comparePaths: (template, actual) ->
    route = new RouteParser template
    route.match actual
