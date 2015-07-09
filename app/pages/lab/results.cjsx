React = require 'react'
ProjectPageEditor = require '../../partials/project-page-editor'

module.exports = React.createClass
  displayName: 'EditProjectResults'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <ProjectPageEditor project={@props.project} page="result" pageTitle="Result" />
    </div>
