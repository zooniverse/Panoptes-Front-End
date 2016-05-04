React = require 'react'
ReactDOM = {render} = require 'react-dom'
{Router, Route, Link} = require 'react-router'
{useBasename} = require 'history'
createBrowserHistory = require 'history/lib/createBrowserHistory'
routes = require './router'
apiClient = require 'panoptes-client/lib/api-client'
style = require '../css/main.styl'

# IE, oh my god:
location.origin ?= location.protocol + "//" + location.hostname + if location.port then ':' + location.port else ''
document.baseURI ?= location.origin + document.querySelector('base').getAttribute('href')

if location?.hash?.indexOf('/') is 1
  location.replace location.hash.slice 1

basename = document.baseURI.slice(location.origin.length)
history = if window.devMode then createBrowserHistory() else useBasename(createBrowserHistory)({basename})

history.listen ->
  window.dispatchEvent new CustomEvent 'locationchange'

render <Router history={history}>{routes}</Router>,
  document.getElementById('panoptes-main-container')

logDeployedCommit = require './lib/log-deployed-commit'
logDeployedCommit()

# For console access:
window?.zooAPI = apiClient
