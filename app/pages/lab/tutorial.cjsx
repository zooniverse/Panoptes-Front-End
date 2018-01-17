React = require 'react'
createReactClass = require 'create-react-class'
ProjectModalEditor = require '../../partials/project-modal-editor'

module.exports = createReactClass
  displayName: 'EditTutorial'

  render: ->
    <div>
      <div>
        <p className="form-label">Project tutorial</p>
        <p>The project tutorial is a step-by-step introduction to the project's interface.</p>
        <p>This is the place to give the volunteers a preview of the data they'll be working with and of the steps they'll be taking to make classifications. It's also a good place to mention any common "gotchas" users might face.</p>
        <p>However, it's also important to keep this as short as possible so volunteers can get started classifying as soon as possible!</p>
        <p><strong>Tutorials should be linked to a workflow on its workflow editor page to pop up for your project.</strong></p>
        <p><strong>You can reorder the steps in your tutorial by clicking and dragging on the left gray tab.</strong></p>
      </div>
      <div>
        <ProjectModalEditor project={@props.project} kind="tutorial" />
      </div>
    </div>
