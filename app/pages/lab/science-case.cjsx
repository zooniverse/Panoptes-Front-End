React = require 'react'

module.exports = React.createClass
  displayName: 'EditProjectScienceCase'

  getDefaultProps: ->
    project: null

  render: ->
    <div>
      Science Case<br />
      <textarea />
    </div>
