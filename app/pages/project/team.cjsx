React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'

ProjectRolesList = React.createClass
  displayName: 'ProjectRolesList'

  render: ->
    <PromiseRenderer promise={@props.project.get('project_roles')}>{(roles) =>
      <ul>
        {for role in roles
          <PromiseRenderer key={role.id} promise={role.get('user')}>{(user) =>
            <li>{user.display_name}: {role.roles.join ', '}</li>
          }</PromiseRenderer>}
      </ul>
    }</PromiseRenderer>

module.exports = React.createClass
  displayName: 'ProjectTeamPage'

  render: ->
    <div className="project-text-content content-container">
      <ProjectRolesList project={@props.project} />
    </div>
