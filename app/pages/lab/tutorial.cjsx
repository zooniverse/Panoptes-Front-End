React = require 'react'
ProjectModalEditor = require '../../partials/project-modal-editor'

module.exports = React.createClass
  displayName: 'EditTutorial'

  render: ->
    <div>
      <div>
        <p>Here’s some text all about the tutorial editor. Lorem ipsum dolor sit amet, etc.</p>
        <p><strong>Work in progress.</strong></p>
      </div>
      <div>
        <ProjectModalEditor project={@props.project} type="tutorials" />
      </div>
    </div>
