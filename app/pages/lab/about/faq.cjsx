React = require 'react'
createReactClass = require 'create-react-class'
ProjectPageEditor = require '../../../partials/project-page-editor'

module.exports = createReactClass
  displayName: 'EditProjectFAQ'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <ProjectPageEditor project={@props.project} page="faq" pageTitle="FAQ" />
    </div>
