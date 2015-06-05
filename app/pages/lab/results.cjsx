React = require 'react'
ResourceInput = require '../../components/resource-input'

module.exports = React.createClass
  displayName: 'EditProjectResults'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <p>
        <ResourceInput type="textarea" className="standard-input full" resource={@props.result} update="science_case" rows="20" placeholder="This page renders markdown. Note that this page will not display unless you add content here.">
          <span className="form-label">Results</span>
          <br />
        </ResourceInput>
      </p>
    </div>
