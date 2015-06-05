React = require 'react'
BoundResourceMixin = require '../../lib/bound-resource-mixin'

module.exports = React.createClass
  displayName: 'EditProjectResults'

  mixins: [BoundResourceMixin]

  boundResource: 'project'

  getDefaultProps: ->
    project: null

  render: ->
    <div>
      <p>Results</p>
      <textarea className="standard-input full" name="result" value={@props.project.result} rows="20" onChange={@handleChange} placeholder="This page renders markdown. Note that this page will not display unless you add content here." />

      <p>
        <button type="button" className="major-button" disabled={@state.saveInProgress or not @props.project.hasUnsavedChanges()} onClick={@saveResource}>Save</button>{' '}
        {@renderSaveStatus()}
      </p>
    </div>
