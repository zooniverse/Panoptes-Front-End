React = require 'react'
ResourceInput = require '../../components/resource-input'

module.exports = React.createClass
  displayName: 'EditProjectScienceCase'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <p className="form-help">This page is for you to describe your research motivations and goals to the volunteers. Feel free to add detail, but try to avoid jargon. This page renders markdown, so you can format it and add images (externally hosted for now) and links. The site will show your team members with their profile pictures and roles to the side of the text.</p>
      <p>
        <ResourceInput type="textarea" className="standard-input full" resource={@props.project} update="science_case" rows="20">
          <span className="form-label">Science case</span>
          <br />
        </ResourceInput>
      </p>
    </div>
