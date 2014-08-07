# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'LoadingIndicator'

  render: ->
    @transferPropsTo <span className="loading-indicator">
      <span>•</span>
      <span>•</span>
      <span>•</span>
    </span>
