React = require 'react'
{Link} = require 'react-router'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
PromiseToSetState = require '../lib/promise-to-set-state'
auth = require '../api/auth'

RequiresSession = React.createClass
  displayName: 'RequiresSession'

  render: ->
    <ChangeListener target={auth} handler={@renderAuth} />

  renderAuth: ->
    <PromiseRenderer promise={auth.checkCurrent()} then={@renderUser} />

  renderUser: (user) ->
    if user?
      if @props.render?
        @props.render user
      else
        @props.children
    else
      <span>You’re not signed in.</span>

module.exports = React.createClass
  displayName: 'BuildPage'

  render: ->
    <div className="content-container">
      <RequiresSession render={@renderUser} />
    </div>

  renderUser: (user) ->
    <div>
      <p>Projects owned by {user.display_name}:</p>
      <PromiseRenderer promise={user.link 'projects'} then={@renderProjectsList}>
        <span>Loading projects...</span>
      </PromiseRenderer>
      <hr />
      <Link to="new-project">Create a new project</Link>
    </div>

  renderProjectsList: (projects) ->
    items = for project in projects
      <li key={project.id}>
        {project.display_name}&nbsp;
        <Link to="edit-project" params={id: project.id}><i className="fa fa-pencil"></i></Link>&nbsp;
        <Link to="project-home" params={id: project.id}><i className="fa fa-hand-o-right"></i></Link>
      </li>

    <ul>
      {items}
    </ul>
