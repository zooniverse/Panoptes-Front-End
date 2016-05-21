counterpart = require 'counterpart'
React = require 'react'
PromiseRenderer = require '../../../components/promise-renderer'
Translate = require 'react-translate-component'
TitleMixin = require '../../../lib/title-mixin'
{Markdown} = require 'markdownz'

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
          <div className="column columns-container">
            <Markdown project={@props.project}>{
                team?.content
            }</Markdown>
            <hr />
          </div>
      }</PromiseRenderer>
      <div>
        <Translate content="projectRoles.title" />
        <PromiseRenderer promise={@props.project.get('project_roles')}>{(projectRoles) =>
          <div>
            {for projectRole in projectRoles then do (projectRole) =>
              <PromiseRenderer key={projectRole.id} promise={projectRole.get('owner')}>{(user) =>
                <p>
                  <img src={user.avatar} className="avatar" />{' '}
                  {user.display_name}{' '}
                  {for role in projectRole.roles
                    <Translate key={role} content="projectRoles.#{role}" className="project-role #{role}" />}
                </p>
              }</PromiseRenderer>}
          </div>
        }</PromiseRenderer>
      </div>
    </div>
