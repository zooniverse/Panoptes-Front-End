React = require 'react'
data = require './data'
MarkdownEditor = require '../../components/markdown-editor'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'NewProjectGeneralPage'

  render: ->
    <div className="content-container">
      <h2>General information</h2>
      <p>Let’s get started by creating a basic description of your project. Everything you define here can be changed until your project goes live.</p>
      <fieldset>
        <legend>Project name</legend>
        <input type="text" name="name" placeholder="Project name" value={data.name} onChange={data.handleInputChange.bind data} style={width: '100%'} />
        <br />
        <div className="form-help">This will be used to identify your project across the site.</div>
      </fieldset>
      <fieldset>
        <legend>Introduction</legend>
        <input type="text" name="introduction" placeholder="A catchy slogan for the project" value={data.introduction} onChange={data.handleInputChange.bind data} style={width: '100%'} />
        <br />
        <div className="form-help">This will often be shown when a link on the site points to your project.</div>
      </fieldset>
      <fieldset>
        <legend>Project description</legend>
        <MarkdownEditor name="description" placeholder="Why is this project interesting?" value={data.description} onChange={data.handleInputChange.bind data} style={width: '100%'} />
        <br />
        <div className="form-help">Tell people why they should help with your project. What question are you trying to answer, and why is it important?</div>
      </fieldset>
      <Link to="new-project-science-case">Next, describe your science case <i className="fa fa-arrow-right"></i></Link>
    </div>
