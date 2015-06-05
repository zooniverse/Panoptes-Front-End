React = require 'react'
BoundResourceMixin = require '../../lib/bound-resource-mixin'

module.exports = React.createClass
  displayName: 'EditProjectEducation'

  mixins: [BoundResourceMixin]

  boundResource: 'project'

  getDefaultProps: ->
    project: null

  render: ->
    <div>
      <p>Educational content</p>
      <textarea className="standard-input full" name="education_content" value={@props.project.education_content} rows="20" onChange={@handleChange} placeholder="This page renders markdown. Note that this page will not display unless you add content here." />

      <p>
        <button type="button" className="major-button" disabled={@state.saveInProgress or not @props.project.hasUnsavedChanges()} onClick={@saveResource}>Save</button>{' '}
        {@renderSaveStatus()}
      </p>
    </div>
