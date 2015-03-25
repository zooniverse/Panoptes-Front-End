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
      <p>
        Science Case<br />
        <textarea className="standard-input full" name="science_case" value={@props.project.science_case} rows="20" onChange={@handleChange} />
      </p>

      <p>
        <button type="button" className="major-button" disabled={@state.saveInProgress or not @props.project.hasUnsavedChanges()} onClick={@saveResource}>Save</button>{' '}
        {@renderSaveStatus()}
      </p>
    </div>
