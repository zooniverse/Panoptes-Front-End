React = require 'react'
handleInputChange = require '../../lib/handle-input-change'

module.exports = React.createClass
  displayName: 'EditProjectResults'

  getDefaultProps: ->
    project: null

  render: ->
    <div className="content-container">
      Results<br />
      <textarea className="standard-input full" name="result" value={@props.project.result} rows="5" onChange={handleInputChange.bind @props.project} />
      <div>
        <button type="button" className="major-button" disabled={Object.keys(@props.project.getChangesSinceSave()).length is 0} onClick={@props.project.save.bind @props.project}>Save</button>
      </div>
    </div>
