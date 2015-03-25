React = require 'react'
BoundResourceMixin = require '../../lib/bound-resource-mixin'

module.exports = React.createClass
  displayName: 'EditProjectDetails'

  mixins: [BoundResourceMixin]

  boundResource: 'project'

  getDefaultProps: ->
    project: null

  render: ->
    <div className="columns-container">
      <div>
        <p>
          Avatar <small>TODO</small> <button type="button" disabled>&times;</button><br />
          <img src="//placehold.it/100x100.png" /><br />
          <input type="file" disabled />
        </p>

        <p>
          Background image <small>TODO</small> <button type="button" disabled>&times;</button><br />
          <img src="//placehold.it/100x75.png" /><br />
          <input type="file" disabled />
        </p>
      </div>

      <div className="column">
        <p>
          Name<br />
          <input type="text" className="standard-input full" name="display_name" value={@props.project.display_name} disabled={@state.saveInProgress} onChange={@handleChange} />
        </p>

        <p>
          Description<br />
          <textarea className="standard-input full" name="description" value={@props.project.description} row="2" disabled={@state.saveInProgress} onChange={@handleChange} />
        </p>

        <p>
          Introduction<br />
          <textarea className="standard-input full" name="introduction" value={@props.project.introduction} rows="10" disabled={@state.saveInProgress} onChange={@handleChange} />
        </p>

        <p>
          <button type="button" className="major-button" disabled={@state.saveInProgress or not @props.project.hasUnsavedChanges()} onClick={@saveResource}>Save</button>{' '}
          {@renderSaveStatus()}
        </p>
      </div>
    </div>
