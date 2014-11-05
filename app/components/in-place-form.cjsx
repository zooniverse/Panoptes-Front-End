React = require 'react'

module.exports = React.createClass
  displayName: 'InPlaceForm'

  overrideSubmit: (e) ->
    e.preventDefault()
    @props.onSubmit? e

  render: ->
    @transferPropsTo <form className="in-place-form" onSubmit={@overrideSubmit}>
      {@props.children}
    </form>
