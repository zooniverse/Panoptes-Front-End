React = require 'react'
TitleMixin = require '../../../lib/title-mixin'
{Markdown} = require 'markdownz'
PromiseRenderer = require '../../../components/promise-renderer'
Translate = require 'react-translate-component'

module.exports = React.createClass
  displayName: 'ProjectTeamPage'

  mixins: [TitleMixin]

  title: 'Team details'

  render: ->
    <div className="project-text-content content-container">
      <PromiseRenderer promise={@props.project.get('pages', url_key: "team").index(0)}>{(team) =>
        <Markdown project={@props.project} className="column">{
          if team?.content
            team?.content
          else
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
        }</Markdown>
      }</PromiseRenderer>
    </div>
