React = require 'react'

module.exports = React.createClass
  displayName: 'InPlaceForm'

  getDefaultProps: ->
    method: 'post'

  overrideSubmit: (e) ->
    e.preventDefault()
    @props.onSubmit? e

  render: ->
    <form method={@props.method} className="in-place-form" onSubmit={@overrideSubmit}>
      {@props.children}
    </form>
