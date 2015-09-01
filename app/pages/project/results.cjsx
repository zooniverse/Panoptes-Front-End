React = require 'react'
TitleMixin = require '../../lib/title-mixin'
{Markdown} = require 'markdownz'
PromiseRenderer = require '../../components/promise-renderer'

module.exports = React.createClass
  displayName: 'ProjectResultsPage'

  mixins: [TitleMixin]

  title: 'Results'

  render: ->
    <div className="project-text-content content-container">
      <PromiseRenderer promise={@props.project.get('pages', url_key: "result").index(0)}>{(faq) =>
        <Markdown project={@props.project} className="column">{
          if faq?.content
            faq?.content
          else
            'This project has no results to report yet.'
        }</Markdown>
      }</PromiseRenderer>
    </div>
