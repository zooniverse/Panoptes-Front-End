React = require 'react'
ProjectModalEditor = require '../../partials/project-modal-editor'

module.exports = React.createClass
  displayName: 'EditMiniCourse'

  render: ->
    <div>
      <div>
        <p>Here’s some text all about the mini-course editor. Lorem ipsum dolor sit amet, etc.</p>
        <p><strong>Work in progress.</strong></p>
      </div>
      <div>
        <ProjectModalEditor project={@props.project} type="minicourses" />
      </div>
    </div>