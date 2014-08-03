stores = []

register = (store) ->
  stores.push store

dispatch = (action, payload...) ->
  unless process.env.NODE_ENV is 'production'
    unless action.indexOf(':') > -1
      console?.warn 'Dispatched actions should have a colon in them to disambiguate them from regular store methods.'

  console?.info 'DISPATCHING', action, payload...

  for store in stores when store[action]?
    # NOTE: If the handler returns a promise, this will wait to emit until it resolves, otheriwse it emits immediately.
    handledValue = store[action] payload...
    Promise.all([handledValue]).then store.emitChange.bind store

module.exports = {register, dispatch}
