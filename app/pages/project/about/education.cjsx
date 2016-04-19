React = require 'react'
TitleMixin = require '../../../lib/title-mixin'
{Markdown} = require 'markdownz'
PromiseRenderer = require '../../../components/promise-renderer'

module.exports = React.createClass
  displayName: 'ProjectEducationPage'

  mixins: [TitleMixin]

  title: 'Educational resources'

  render: ->
    console.log 'went to education'
    <div className="project-text-content content-container">
      <p>education page</p>
    </div>
