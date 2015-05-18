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
      <p className="form-help">Once your project has hit its stride, share the results of your project with your volunteers here.</p>
      <p className="form-help">This page renders markdown. Note that this page will not display unless you add content here.</p>
      <textarea className="standard-input full" name="result" value={@props.project.result} rows="20" onChange={@handleChange} />

      <p>
        <button type="button" className="major-button" disabled={@state.saveInProgress or not @props.project.hasUnsavedChanges()} onClick={@saveResource}>Save</button>{' '}
        {@renderSaveStatus()}
      </p>
    </div>
