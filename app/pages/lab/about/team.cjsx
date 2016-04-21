React = require 'react'
ProjectPageEditor = require '../../../partials/project-page-editor'

module.exports = React.createClass
  displayName: 'EditProjectTeam'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <ProjectPageEditor project={@props.project} page="team" pageTitle="Team" />
    </div>
