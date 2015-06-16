React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
apiClient = require '../api/client'
talkClient = require '../api/talk'
{Navigation} = require 'react-router'

# Render this component with just an ID param (of subject), and it'll build up the project url

module?.exports = React.createClass
  displayName: 'RedirectToProjectTalkSubject'
  mixins: [Navigation]

  goToProjectTalkSubject: (owner, project, subjectId) ->
    @replaceWith('project-talk-subject', {owner: owner.slug, name: project.slug, id: subjectId})

  render: ->
    {id} = @props.params

    subject = apiClient.type('subjects').get(id)
    project = subject.then (subject) => subject.get('project')
    owner = project.then (project) => project.get('owner')

    <PromiseRenderer pending={null} promise={Promise.all [subject, project, owner]}>{([_, project, owner]) =>
      @goToProjectTalkSubject(owner, project, id)
    }</PromiseRenderer>
