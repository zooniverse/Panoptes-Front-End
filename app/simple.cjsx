React = require 'react'

module.exports = React.createClass
  displayName: 'Coffee Time'

  render: ->
    <p>Hello from CoffeeScript, <span className="name">{@props.name}</span></p>
