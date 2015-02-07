React = require 'react'
TitleMixin = require '../../lib/title-mixin'
Markdown = require '../../components/markdown'

module.exports = React.createClass
  displayName: 'ProjectScienceCasePage'

  mixins: [TitleMixin]

  title: 'Science case'

  render: ->
    <div className="project-text-content content-container">
      <Markdown>{@props.project.science_case}</Markdown>
    </div>
