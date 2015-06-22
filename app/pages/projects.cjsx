counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
apiClient = require '../api/client'
OwnedCardList = require '../components/owned-card-list'

counterpart.registerTranslations 'en',
  projectsPage:
    title: 'All Projects'
    countMessage: 'Showing %(count)s found'
    button: 'Get Started'
    notFoundMessage: 'Sorry, no projects found'

module.exports = React.createClass
  displayName: 'ProjectsPage'

  mixins: [TitleMixin]

  title: 'Projects'

  listProjects: ->
    query =
      launch_approved: true
      include:'owners,avatar'
    Object.assign query, @props.query

    apiClient.type('projects').get query

  imagePromise: (project) ->
    project.get('avatar')
      .then (avatar) -> avatar.src

  render: ->
    <OwnedCardList
      translationObjectName="projectsPage"
      listPromise={@listProjects()}
      linkTo="projects"
      cardLink="project-home"
      heroClass="projects-hero"
      imagePromise={@imagePromise} />
