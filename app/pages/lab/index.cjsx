React = require 'react'
{Link, RouteHandler} = require 'react-router'

module.exports = React.createClass
  displayName: 'EditProjectIndex'

  getDefaultProps: ->
    project: id: '2'

  render: ->
    <div className="columns-container">
      <div>
        <ul>
          <li><Link to="edit-project-details" params={projectID: '2'}>Project details</Link></li>
          <li><Link to="edit-project-science-case" params={projectID: '2'}>Science case</Link></li>
          <li><Link to="edit-project-results" params={projectID: '2'}>Results</Link></li>
          <li><Link to="edit-project-collaborators" params={projectID: '2'}>Collaborators</Link></li>
          <li>
            <header>Workflows</header>
            <ul>
              <li><Link to="edit-project-workflow" params={projectID: '2', workflowID: '2'}>Get started</Link></li>
              <li><button type="button">New workflow</button></li>
            </ul>
          </li>
          <li>
            <header>Subject sets</header>
            <ul>
              <li><Link to="edit-project-subject-set" params={projectID: '2', subjectSetID: '2'}>Get started expert subjects</Link></li>
              <li><Link to="edit-project-subject-set" params={projectID: '2', subjectSetID: '2'}>Get started initial subjects</Link></li>
              <li><button type="button">New subject set</button></li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="column">
        <RouteHandler {...@props} />
      </div>
    </div>
