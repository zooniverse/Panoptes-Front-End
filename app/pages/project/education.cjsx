React = require 'react'
TitleMixin = require '../../lib/title-mixin'
{Markdown} = require 'markdownz'
PromiseRenderer = require '../../components/promise-renderer'

module.exports = React.createClass
  displayName: 'ProjectEducationPage'

  mixins: [TitleMixin]

  title: 'Educational resources'

  render: ->
    <div className="project-text-content content-container">
      <PromiseRenderer promise={@props.project.get('pages', url_key: "education").index(0)}>{(education) =>
        <Markdown project={@props.project} className="column">{
          if education?.content
            education?.content
          else
            'This project has no educational resources yet.'
        }</Markdown>
      }</PromiseRenderer>
    </div>
