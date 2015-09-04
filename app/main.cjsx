React = require 'react'
Router = require '@edpaget/react-router'

React.initializeTouchEvents true

routes = require './router'

if process.env.NON_ROOT isnt 'true' and location? and location.hash isnt ""
  location.pathname = location.hash.slice(1)

location = if process.env.NON_ROOT == "true"
    null
  else
    Router.HistoryLocation

router = Router.create {location, routes}

router.run (Handler, handlerProps) ->
  window.dispatchEvent new CustomEvent 'locationchange'
  React.render(<Handler {...handlerProps} />, document.getElementById("panoptes-main-container"));

logDeployedCommit = require './lib/log-deployed-commit'
logDeployedCommit()
