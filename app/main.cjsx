React = require 'react'
window.React = React
React.initializeTouchEvents true

router = require './router'
mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer
router.run (Handler, handlerProps) ->
  React.render(<Handler {...handlerProps} />, mainContainer);

logDeployedCommit = require './lib/log-deployed-commit'
logDeployedCommit()
