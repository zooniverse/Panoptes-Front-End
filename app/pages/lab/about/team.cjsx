React = require 'react'
createReactClass = require 'create-react-class'
ProjectPageEditor = require '../../../partials/project-page-editor'

module.exports = createReactClass
  displayName: 'EditProjectTeam'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <p className="form-help">The site will show your team members and their roles to the side of the text. Additional team information may be provided below.</p>
      <ProjectPageEditor project={@props.project} page="team" pageTitle="Team" />
    </div>
