React = require 'react'
ProjectPageEditor = require '../../partials/project-page-editor'

module.exports = React.createClass
  displayName: 'EditProjectEducation'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <ProjectPageEditor project={@props.project} page="education" pageTitle="Education" />
    </div>
