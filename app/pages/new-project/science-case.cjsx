React = require 'react'
MarkdownEditor = require '../../components/markdown-editor'
data = require './data'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'NewProjectScienceCasePage'

  render: ->
    <div className="content-container">
      <h2>Science case</h2>
      <fieldset>
        <MarkdownEditor name="scienceCase" placeholder="A more detailed explanation of what you hope to achieve with the data you collect" value={data.scienceCase} onChange={data.handleInputChange.bind data} />
        <span /><div className="form-help">Tell people how the data you collect will be used. What is the expected output of this project?</div>
      </fieldset>
      <Link to="new-project-subjects">Next, select some subjects <i className="fa fa-arrow-right"></i></Link>
    </div>
