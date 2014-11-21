React = require 'react'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
auth = require '../api/auth'

module.exports = React.createClass
  displayName: 'BuildPage'

  render: ->
    <div className="content-container">
      <ChangeListener target={auth} handler={@renderAuth} />
    </div>

  renderAuth: ->
    <PromiseRenderer promise={auth.checkCurrent()} then={@renderUser}>
      <p className="form-help">Waiting for signed-in status...</p>
    </PromiseRenderer>

  renderUser: (user) ->
    if user?
      <div>
        <p>Signed in as: {user.display_name}</p>
        <p><strong>Projects</strong></p>
        <PromiseRenderer promise={user.attr 'projects'} then={@renderProjectsList}>
          <p>Getting your projects...</p>
        </PromiseRenderer>
        <hr />
        <a href="#/build/new-project">Create a new project</a>
      </div>

    else
      <p>
        <strong>You’re not signed in.</strong>
      </p>

  renderProjectsList: (projects) ->
    items = for project in projects
      <li key={project.id}><a href={'#/build/' + project.id}>{project.display_name}</a></li>

    <ul>
      {items}
    </ul>
