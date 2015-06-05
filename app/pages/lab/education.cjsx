React = require 'react'
ResourceInput = require '../../components/resource-input'

module.exports = React.createClass
  displayName: 'EditProjectEducation'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <p>
        <ResourceInput type="textarea" className="standard-input full" resource={@props.project} update="education_content" rows="20" placeholder="This page renders markdown. Note that this page will not display unless you add content here.">
          <span className="form-label">Educational Content</span>
          <br />
        </ResourceInput>
      </p>
    </div>
