React = require 'react'
createReactClass = require 'create-react-class'
ProjectPageEditor = require '../../../partials/project-page-editor'

module.exports = createReactClass
  displayName: 'EditProjectEducation'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <ProjectPageEditor project={@props.project} page="education" pageTitle="Education" />
    </div>
