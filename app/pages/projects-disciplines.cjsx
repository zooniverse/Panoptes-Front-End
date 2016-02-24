counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
apiClient = require 'panoptes-client/lib/api-client'
OwnedCardList = require '../components/owned-card-list-by-discipline'

counterpart.registerTranslations 'en',
  projectsPage:
    title: 'All Projects'
    countMessage: 'Showing %(pageStart)s-%(pageEnd)s of %(count)s found'
    button: 'Get Started'
    notFoundMessage: 'Sorry, no projects found'

module.exports = React.createClass
  displayName: 'ProjectsPage'

  mixins: [TitleMixin]

  title: 'Projects'

  listProjects: ->
    query =
      include:'avatar'
    if !apiClient.params.admin
      query.launch_approved = true
    Object.assign query, @props.query

    apiClient.type('projects').get query

  imagePromise: (project) ->
    project.get('avatar')
      .then (avatar) -> avatar.src

  cardLink: (project) ->
    link = if !!project.redirect
      project.redirect
    else
      'project-home'

    return link

  render: ->
    <OwnedCardList
      translationObjectName="projectsPage"
      listPromise={@listProjects()}
      linkTo="projects"
      cardLink={@cardLink}
      heroClass="projects-hero"
      imagePromise={@imagePromise} />
