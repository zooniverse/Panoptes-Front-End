React = require 'react'

module.exports = React.createClass
  displayName: 'LoadingIndicator'

  render: ->
    <span className="loading-indicator">
      <span className="loading-indicator-icon"></span>{' '}
      {@props.children}
    </span>
