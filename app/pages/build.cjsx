React = require 'react'
{Link} = require 'react-router'
PromiseRenderer = require '../components/promise-renderer'
Loading = require '../components/loading-indicator'

module.exports = React.createClass
  displayName: 'BuildPage'

  render: ->
    pendingFunc = ->
      <Loading />

    thenFunc = (projects) =>
      <ul>
        {projects.map (project) ->
          <li key={project.id}>
            {project.display_name}&nbsp;
            <Link to="edit-project" params={id: project.id}><i className="fa fa-pencil"></i></Link>&nbsp;
            <Link to="project-home" params={owner: @props.user.display_name, name: project.display_name}><i className="fa fa-hand-o-right"></i></Link>
          </li>}
      </ul>

    <div className="content-container">
      {if @props.user?
        <div>
          <p>Projects owned by {@props.user.display_name}:</p>
          <PromiseRenderer
            promise={@props.user.get 'projects', skipCache: true}
            pendingFunc={pendingFunc}
            then={thenFunc} />
          <hr />
          <Link to="new-project">Create a new project</Link>
        </div>
      else
        <p>You must be signed in to view your projects.</p>}
    </div>
