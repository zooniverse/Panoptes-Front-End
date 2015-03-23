React = require 'react'
UnsavedChangesWarningMixin = require '../../lib/unsaved-changes-warning-mixin'
handleInputChange = require '../../lib/handle-input-change'

module.exports = React.createClass
  displayName: 'EditProjectDetails'

  mixins: [UnsavedChangesWarningMixin]

  getDefaultProps: ->
    project: null

  render: ->
    unsavedChanges = @props.project.getChangesSinceSave()
    handleChange = handleInputChange.bind @props.project
    <div className="columns-container">
      <div style={opacity: 0.5}>
        <div>
          Avatar <button type="button">&times;</button><br />
          <img src="//placehold.it/100x100.png" /><br />
          <input type="file" />
        </div>
        <div>
          Background image <button type="button">&times;</button><br />
          <img src="//placehold.it/100x75.png" /><br />
          <input type="file" />
        </div>
      </div>
      <div className="column content-container">
        <div>
          Name<br />
          <input type="text" className="standard-input full" name="display_name" value={@props.project.display_name} onChange={handleChange} />
        </div>
        <div>
          Description<br />
          <textarea className="standard-input full" name="description" value={@props.project.description} row="2" onChange={handleChange} />
        </div>
        <div>
          Introduction<br />
          <textarea className="standard-input full" name="introduction" value={@props.project.introduction} rows="5" onChange={handleChange} />
        </div>
        <div>
          <button type="button" className="major-button" disabled={Object.keys(@props.project.getChangesSinceSave()).length is 0} onClick={@props.project.save.bind @props.project}>Save</button>
        </div>
      </div>
    </div>
