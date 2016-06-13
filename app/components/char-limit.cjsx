React = require 'react'

module.exports = React.createClass
  propTypes:
    limit: React.PropTypes.number.isRequired
    string: React.PropTypes.string.isRequired

  getDefaultProps: ->
    limit: 0
    string: ''

  render: ->
    remaining = @props.limit - @props.string.length
    <span>
      {remaining} of {@props.limit} characters remaining.
    </span>
