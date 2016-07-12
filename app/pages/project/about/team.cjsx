counterpart = require 'counterpart'
React = require 'react'
PromiseRenderer = require '../../../components/promise-renderer'
Translate = require 'react-translate-component'
TitleMixin = require '../../../lib/title-mixin'
{Markdown} = (require 'markdownz').default
Avatar = require '../../../partials/avatar'

counterpart.registerTranslations 'en',
  projectRoles:
    title: 'The Team'
    owner: 'Owner'
    collaborator: 'Collaborator'
    translator: 'Translator'
    scientist: 'Researcher'
    moderator: 'Moderator'
    tester: 'Tester'
    expert: 'Expert'

module.exports = React.createClass
  displayName: 'ProjectTeamPage'

  mixins: [TitleMixin]

  title: 'Team details'

  render: ->
    <div className="columns-container">
      <PromiseRenderer promise={@props.project.get('pages', url_key: "team").index(0)}>{(team) =>
        if team?.content
          <Markdown project={@props.project} className="column">{
              team?.content
          }</Markdown>
      }</PromiseRenderer>
      <hr />
      <aside>
        <Translate content="projectRoles.title" />
        <PromiseRenderer promise={@props.project.get('project_roles')}>{(projectRoles) =>
          <ul className="team-list">
            {for projectRole in projectRoles then do (projectRole) =>
              <PromiseRenderer key={projectRole.id} promise={projectRole.get('owner')}>{(user) =>
                <li className="team-list-item">
                  <span className="team-list-item__display-name">
                    <Avatar user={user} className="avatar" />{' '}
                    {user.display_name}{' '}
                  </span>
                  <span className="team-list-item__project-roles">
                  {for role in projectRole.roles
                    <Translate key={role} content="projectRoles.#{role}" className="project-role #{role}" />}
                  </span>
                </li>
              }</PromiseRenderer>}
          </ul>
        }</PromiseRenderer>
      </aside>
    </div>
