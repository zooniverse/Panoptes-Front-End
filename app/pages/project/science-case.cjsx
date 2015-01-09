React = require 'react'
Markdown = require '../../components/markdown'

module.exports = React.createClass
  displayName: 'ProjectScienceCasePage'

  render: ->
    <div className="project-text-content content-container">
      <Markdown>
        {@props.project.science_case}
      </Markdown>
    </div>
