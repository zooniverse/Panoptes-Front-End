React = require 'react'
TitleMixin = require '../../lib/title-mixin'
Markdown = require '../../components/markdown'

module.exports = React.createClass
  displayName: 'ProjectFAQPage'

  mixins: [TitleMixin]

  title: 'FAQ'

  render: ->
    <div className="project-text-content content-container">
      <Markdown>{@props.project.faq || 'This project has no frequently asked questions yet.'}</Markdown>
    </div>
