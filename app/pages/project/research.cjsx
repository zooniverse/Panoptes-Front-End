counterpart = require 'counterpart'
React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
Translate = require 'react-translate-component'
TitleMixin = require '../../lib/title-mixin'
{Markdown} = require 'markdownz'

counterpart.registerTranslations 'en',
  projectRoles:
    title: 'The team'
    owner: 'Owner'
    collaborator: 'Collaborator'
    translator: 'Translator'
    scientist: 'Scientist'
    moderator: 'Moderator'
    tester: 'Tester'
    expert: 'Expert'

module.exports = React.createClass
  displayName: 'ProjectScienceCasePage'

  mixins: [TitleMixin]

  title: 'Science case'

  render: ->
    <div className="project-text-content content-container">
      <div className="columns-container">
        <PromiseRenderer promise={@props.project.get('pages', url_key: "science_case").index(0)}>{(science_case) =>
          <Markdown className="column">{
            if science_case?.content
              science_case?.content
            else
              'This project has no science case yet.'
          }</Markdown>
        }</PromiseRenderer>
        <hr />
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
    </div>
