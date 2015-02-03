React = require 'react'

module.exports = React.createClass
  displayName: 'InPlaceForm'

  getDefaultProps: ->
    onSubmit: null

  render: ->
    <form className="in-place-form" onSubmit={@handleSubmit}>
      {@props.children}
    </form>

  handleSubmit: (e) ->
    e.preventDefault()
    @props.onSubmit? e
