React = require 'react'
BoundResourceMixin = require '../../lib/bound-resource-mixin'

module.exports = React.createClass
  displayName: 'EditProjectFAQ'

  mixins: [BoundResourceMixin]

  boundResource: 'project'

  getDefaultProps: ->
    project: null

  render: ->
    <div>
      <p>FAQ</p>
      <textarea className="standard-input full" name="faq" value={@props.project.faq} rows="20" onChange={@handleChange} placeholder="This page renders markdown. Note that this page will not display unless you add content here." />

      <p>
        <button type="button" className="major-button" disabled={@state.saveInProgress or not @props.project.hasUnsavedChanges()} onClick={@saveResource}>Save</button>{' '}
        {@renderSaveStatus()}
      </p>
    </div>
