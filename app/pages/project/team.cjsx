counterpart = require 'counterpart'
React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
Translate = require 'react-translate-component'

counterpart.registerTranslations 'en',
  projectRoles:
    owner: 'Owner'
    translator: 'Translator'

ProjectRolesList = React.createClass
  displayName: 'ProjectRolesList'

  render: ->
    <PromiseRenderer promise={@props.project.get('project_roles')}>{(projectRoles) =>
      <ul>
        {for projectRole in projectRoles then do (projectRole) =>
          <PromiseRenderer key={projectRole.id} promise={projectRole.get('owner')}>{(user) =>
            <li>
              <img src={user.avatar} className="avatar" />{' '}
              <strong>{user.display_name}</strong>{' '}
              {for role in projectRole.roles
                <Translate key={role} content="projectRoles.#{role}" className="project-role #{role}" />}
            </li>
          }</PromiseRenderer>}
      </ul>
    }</PromiseRenderer>

module.exports = React.createClass
  displayName: 'ProjectTeamPage'

  render: ->
    <div className="project-text-content content-container">
      <ProjectRolesList project={@props.project} />
    </div>
