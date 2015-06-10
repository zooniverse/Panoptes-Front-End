React = require 'react'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'

module.exports = React.createClass
  displayName: 'EditProjectResults'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <p>
        <AutoSave resource={@props.project}>
          <span className="form-label">Results</span>
          <br />
          <textarea className="standard-input full" name="result" value={@props.project.result} rows="20" onChange={handleInputChange.bind @props.project} />
        </AutoSave>
      </p>
    </div>
