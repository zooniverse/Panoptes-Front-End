React = require 'react'

module.exports = React.createClass
  displayName: 'LoadingIndicator'

  render: ->
    <span {...@props} className="loading-indicator">
      <span>•</span>
      <span>•</span>
      <span>•</span>
    </span>
