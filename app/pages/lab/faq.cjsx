React = require 'react'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'

module.exports = React.createClass
  displayName: 'EditProjectFAQ'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <p>
        <AutoSave resource={@props.project}>
          <span className="form-label">F.A.Q.</span>
          <br />
          <textarea className="standard-input full" name="faq" value={@props.project.faq} rows="20" onChange={handleInputChange.bind @props.project} />
        </AutoSave>
      </p>
    </div>
