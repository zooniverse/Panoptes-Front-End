counterpart = require 'counterpart'
React = require 'react'
PromiseRenderer = require '../../../components/promise-renderer'
TitleMixin = require '../../../lib/title-mixin'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  projectRoles:
    title: 'The team'
    owner: 'Owner'
    collaborator: 'Collaborator'
    translator: 'Translator'
    scientist: 'Researcher'
    moderator: 'Moderator'
    tester: 'Tester'
    expert: 'Expert'

module.exports = React.createClass
  displayName: 'ProjectScienceCasePage'

  mixins: [TitleMixin]

  title: 'Science case'

  render: ->
    <div>
      <div className="columns-container">
        <PromiseRenderer promise={@props.project.get('pages', url_key: "science_case").index(0)}>{(science_case) =>
          <Markdown project={@props.project} className="column">{
            if science_case?.content
              science_case?.content
            else
              'This project has no science case yet.'
          }</Markdown>
        }</PromiseRenderer>
      </div>
    </div>
