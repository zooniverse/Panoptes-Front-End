React = require 'react'
ReactDOM = {render} = require 'react-dom'
{Router, Route, Link} = require 'react-router'
createBrowserHistory = require 'history/lib/createBrowserHistory'
routes = require './router'

routes = require './router'
history = createBrowserHistory()

if process.env.NON_ROOT isnt 'true' and window.location? and window.location.hash isnt ""
  window.location.pathname = window.location.hash.slice(1)

history.listen (location) ->
  window.dispatchEvent new CustomEvent 'locationchange'

location = if process.env.NON_ROOT == "true"
    null
  else
    Router.HistoryLocation

render <Router history={history}>{routes}</Router>,
  document.getElementById('panoptes-main-container')

logDeployedCommit = require './lib/log-deployed-commit'
logDeployedCommit()
