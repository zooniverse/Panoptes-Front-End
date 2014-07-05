stores = []

dispatch = (signal, payload...) ->
  for store in stores
    store.handlers[signal]?.call store, payload...

register = (store) ->
  stores.push store

module.exports = {register, dispatch}
