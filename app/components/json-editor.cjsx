React = require 'react'

# This thing is only temporary until we get the real workflow UI figured out.

module.exports = React.createClass
  displayName: 'JSONEditor'

  render: ->
    valid = try JSON.parse @props.value
    unless valid
      style = outline: '2px solid red'

    <textarea {...@props} className="json-editor" style={style} />
