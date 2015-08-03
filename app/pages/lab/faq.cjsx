React = require 'react'
ProjectPageEditor = require '../../partials/project-page-editor'

module.exports = React.createClass
  displayName: 'EditProjectFAQ'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <ProjectPageEditor project={@props.project} page="faq" pageTitle="FAQ" />
    </div>
