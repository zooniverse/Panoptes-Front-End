RouteParser = require 'route-parser'
zipObject = require 'lodash.zipobject'

a = document.createElement 'a'

queryStringPairs = (queryString) ->
  queryString?.split('&').map (keyval) -> keyval.split '='

module.exports =
  parseLocation: ->
    [path, queryString] = location.hash.slice(1).split('?')

    a.href = path
      .replace(/\/$/g, '') # trim trailing slash

    query = zipObject queryStringPairs(queryString)

    path: a.pathname
    hash: a.hash.slice 1
    query: query

  comparePaths: (template, actual) ->
    route = new RouteParser template
    route.match actual
