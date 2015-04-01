React = require 'react'

module.exports = React.createClass
  displayName: 'LoadingIndicator'

  getDefaultProps: ->
    off: false

  render: ->
    visibility = if @props.off
      'hidden'
    else
      ''

    <span className="loading-indicator" style={{visibility}}>
      <span className="loading-indicator-icon"></span>{' '}
      {@props.children}
    </span>
