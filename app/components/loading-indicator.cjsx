React = require 'react'
createReactClass = require 'create-react-class'

module.exports = createReactClass
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
