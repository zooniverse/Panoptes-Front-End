React = require 'react'
window.React = React
React.initializeTouchEvents true

router = require './router'
mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

if process.env.NON_ROOT isnt 'true' and location.hash isnt ""
  location.pathname = location.hash.slice(1)

router.run (Handler, handlerProps) ->
  window.dispatchEvent new Event 'locationchange'
  React.render(<Handler {...handlerProps} />, mainContainer);

logDeployedCommit = require './lib/log-deployed-commit'
logDeployedCommit()
