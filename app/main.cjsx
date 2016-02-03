React = require 'react'
ReactDOM = {render} = require 'react-dom'
{Router, Route, Link} = require 'react-router'
{useBasename} = require 'history'
createBrowserHistory = require 'history/lib/createBrowserHistory'
routes = require './router'

routes = require './router'

basename = if process.env.DEPLOY_SUBDIR? then "/panoptes-front-end/#{process.env.DEPLOY_SUBDIR}/" else ''

history = useBasename(createBrowserHistory)({basename})

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

# For console access:
window?.zooAPI = require 'panoptes-client/lib/api-client'
