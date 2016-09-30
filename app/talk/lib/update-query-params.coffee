parseQuery = ->
  query = window.location.search.replace('?', '').split '&'
  params = { }

  for string in query
    [key, value] = string.split '='
    params[key] = value if key

  params

module.exports = (reactHistory, queryChange) ->
  nextQuery = Object.assign { }, parseQuery(), queryChange
  nextHref = reactHistory.createHref window.location.pathname, nextQuery
  reactHistory.push nextHref
