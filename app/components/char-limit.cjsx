React = require 'react'

module.exports = React.createClass

  getDefaultProps: ->
    limit: 0
    string: ''

  render: ->
    remaining = @props.limit - @props.string.length
    <span>
      {remaining} of {@props.limit} characters remaining.
    </span>

