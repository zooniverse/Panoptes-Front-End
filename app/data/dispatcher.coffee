stores = []

register = (store) ->
  stores.push store

dispatch = (action, payload...) ->
  console?.info 'DISPATCHING', action, payload...

  for store in stores when store.handlers[action]?
    # NOTE: If the handler returns a promise, this will wait to emit until it resolves, otheriwse it emits immediately.
    handledValue = store.handlers[action].call store, payload...
    Promise.all([handledValue]).then store.emitChange.bind store

module.exports = {register, dispatch}
