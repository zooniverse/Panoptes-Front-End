React = require 'react'
BoundResourceMixin = require '../../lib/bound-resource-mixin'

module.exports = React.createClass
  displayName: 'EditProjectScienceCase'

  mixins: [BoundResourceMixin]

  boundResource: 'project'

  getDefaultProps: ->
    project: null

  render: ->
    <div>
      <p>Science Case</p>
      <p className="form-help">This page is for you to describe your research motivations and goals to the volunteers. Feel free to add detail, but try to avoid jargon. This page renders markdown, so you can format it and add images (externally hosted for now) and links. The site will show your team members with their avatars and roles to the side of the text.</p>
      <p className="form-help">Explain your research to your audience here in as much detail as you’d like.</p>
      <textarea className="standard-input full" name="science_case" value={@props.project.science_case} rows="20" onChange={@handleChange} />

      <p>
        <button type="button" className="major-button" disabled={@state.saveInProgress or not @props.project.hasUnsavedChanges()} onClick={@saveResource}>Save</button>{' '}
        {@renderSaveStatus()}
      </p>
    </div>
