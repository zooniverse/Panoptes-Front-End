React = require 'react'
TitleMixin = require '../../lib/title-mixin'
Markdown = require '../../components/markdown'

module.exports = React.createClass
  displayName: 'ProjectEducationPage'

  mixins: [TitleMixin]

  title: 'Educational resources'

  render: ->
    <div className="project-text-content content-container">
      <Markdown>{@props.project.education_content || 'This project has no educational resources yet.'}</Markdown>
    </div>
