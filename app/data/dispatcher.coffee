stores = []

dispatch = (action, payload...) ->
  for store in stores
    store.handlers[action]?.call store, payload...

register = (store) ->
  stores.push store

module.exports = {register, dispatch}
