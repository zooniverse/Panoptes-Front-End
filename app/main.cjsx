React = require 'react'
ReactDOM = {render} = require 'react-dom'
{Router, Route, Link} = require 'react-router'
{useBasename} = require 'history'
createBrowserHistory = require 'history/lib/createBrowserHistory'
routes = require './router'

# IE < 11 doesn't support `document.baseURI` (test this).
document.baseURI ?= location.origin + document.querySelector('base').getAttribute('href')

if location?.hash?.indexOf('/') is 1
  location.replace location.hash.slice 1

basename = document.baseURI
history = useBasename(createBrowserHistory)({basename})

history.listen (location) ->
  window.dispatchEvent new CustomEvent 'locationchange'

render <Router history={history}>{routes}</Router>,
  document.getElementById('panoptes-main-container')

logDeployedCommit = require './lib/log-deployed-commit'
logDeployedCommit()

# For console access:
window?.zooAPI = require 'panoptes-client/lib/api-client'
