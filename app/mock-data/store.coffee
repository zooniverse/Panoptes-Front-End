# NOTE: Store/dispatcher stuff is no longer used.
# Call methods on resources or collections directly.

dispatcher = require '../lib/dispatcher'
Model = require '../lib/model'

class Store extends Model
  root: '' # The endpoint to query from and post to, e.g. "/subjects"
  keyedOn: 'id'
  examples: []

  constructor: (options = {}) ->
    @items = {}
    super
    dispatcher.register this

  create: (instance) ->
    if @type?
      instance = new @type instance

    key = instance[@keyedOn] ? Math.random().toString().split('.')[1]
    instance[@keyedOn] = key
    @items[key] = instance
    @items[key]

  get: (query, enough = Infinity) ->
    if typeof query is 'string'
      new Promise (resolve) =>
        [key, query] = [query, {}]
        query[@keyedOn] = key
        @items[key] ?= @fetch(query).then ([result]) => result
        resolve @items[key]
    else
      matches = (item for key, item of @items when item? and @matchesQuery item, query)

      if matches.length < enough
        @fetch(query).then (results) =>
          for result in results
            @items[result[@keyedOn]] = result
      else
        new Promise (resolve) ->
          resolve matches

  fetch: (query) ->
    fetchItems = new Promise (resolve, reject) =>
      # console?.info 'GET', @root, query
      matches = (item for item in @examples when @matchesQuery item, query)
      setTimeout resolve.bind(null, matches), 1000

    fetchItems.then (results) =>
      # console?.info 'Got', @root, {results}
      for item in results
        @items[item[@keyedOn]] = item
      @emitChange()
      results

  matchesQuery: (item, query) ->
    match = true
    for key, value of query
      unless value[0] is '*' or item[key] is value
        match = false
    match

module.exports = Store
