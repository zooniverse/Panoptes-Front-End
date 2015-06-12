React = require 'react'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'

module.exports = React.createClass
  displayName: 'EditProjectEducation'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <p>
        <AutoSave resource={@props.project}>
          <span className="form-label">Educational Content</span>
          <br />
          <textarea className="standard-input full" name="education_content" value={@props.project.education_content} rows="20" onChange={handleInputChange.bind @props.project} />
        </AutoSave>
      </p>
    </div>
