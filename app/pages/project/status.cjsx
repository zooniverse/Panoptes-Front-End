React = require 'react'
Dashboard = require '../dashboard'

module.exports = React.createClass
  displayName: 'ProjectStatusPage'

  render: ->
    <div className="project-text-content content-container">
      <div>
        <hr Dashboard project={@props.project} />
      </div>
    </div>
