React = require 'react'
ReactDOM = require 'react-dom'
{Router, browserHistory} = require 'react-router'
routes = require './router'
style = require '../css/main.styl'

# Redirect any old `/#/foo`-style URLs to `/foo`.
if location?.hash.charAt(1) is '/'
  location.replace location.hash.slice 1

browserHistory.listen ->
  dispatchEvent new CustomEvent 'locationchange'

ReactDOM.render <Router history={browserHistory}>{routes}</Router>,
  document.getElementById('panoptes-main-container')

# Are we connected to the latest back end?
require('./lib/log-deployed-commit')()

# Just for console access:
window?.zooAPI = require 'panoptes-client/lib/api-client'
