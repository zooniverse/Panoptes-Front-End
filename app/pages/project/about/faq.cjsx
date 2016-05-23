React = require 'react'
TitleMixin = require '../../../lib/title-mixin'
{Markdown} = (require 'markdownz').default
PromiseRenderer = require '../../../components/promise-renderer'

module.exports = React.createClass
  displayName: 'ProjectFAQPage'

  mixins: [TitleMixin]

  title: 'FAQ'

  render: ->
    <div>
      <PromiseRenderer promise={@props.project.get('pages', url_key: "faq").index(0)}>{(faq) =>
        <Markdown project={@props.project} className="column">{
          if faq?.content
            faq?.content
          else
            'This project has no frequently asked questions yet.'
        }</Markdown>
      }</PromiseRenderer>
    </div>
