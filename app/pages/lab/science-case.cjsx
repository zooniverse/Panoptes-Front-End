React = require 'react'
handleInputChange = require '../../lib/handle-input-change'

module.exports = React.createClass
  displayName: 'EditProjectScienceCase'

  getDefaultProps: ->
    project: null

  render: ->
    <div className="content-container">
      Science Case<br />
      <textarea className="standard-input full" name="science_case" value={@props.project.science_case} rows="5" onChange={handleInputChange.bind @props.project} />
      <div>
        <button type="button" className="major-button" disabled={Object.keys(@props.project.getChangesSinceSave()).length is 0} onClick={@props.project.save.bind @props.project}>Save</button>
      </div>
    </div>
