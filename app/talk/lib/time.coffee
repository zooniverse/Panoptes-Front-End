moment = require 'moment'

module.exports =
  timestamp: (ts) ->
    moment(ts).format('MMMM Do YYYY, h:mm a')

  timeAgo: (t) ->
    moment(t).fromNow()
