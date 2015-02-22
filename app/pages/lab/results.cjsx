React = require 'react'

module.exports = React.createClass
  displayName: 'EditProjectResults'

  getDefaultProps: ->
    project: null

  render: ->
    <div>
      Results<br />
      <textarea />
    </div>
