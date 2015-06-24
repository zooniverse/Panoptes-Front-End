React = require 'react'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'

module.exports = React.createClass
  displayName: 'EditProjectScienceCase'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <p className="form-help">This page is for you to describe your research motivations and goals to the volunteers. Feel free to add detail, but try to avoid jargon. This page renders markdown, so you can format it and add images via the Media Library and links. The site will show your team members with their profile pictures and roles to the side of the text.</p>
      <p>
        <AutoSave resource={@props.project}>
          <span className="form-label">Science case</span>
          <br />
          <textarea className="standard-input full" name="science_case" value={@props.project.science_case} rows="20" onChange={handleInputChange.bind @props.project} />
        </AutoSave>
      </p>
    </div>
