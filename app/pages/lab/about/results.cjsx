React = require 'react'
ProjectPageEditor = require '../../../partials/project-page-editor'

module.exports = React.createClass
  displayName: 'EditProjectResults'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <p className="form-help">This page is for you to share the results from your project with the volunteers and the public. The Results page will only be visible on your project's website through the About tab if you have text entered below. You can also add images to this page via the Media Library. </p>
      <ProjectPageEditor project={@props.project} page="results" pageTitle="Results" />
    </div>
