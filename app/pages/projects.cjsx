counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
apiClient = require '../api/client'
OwnedCardList = require '../components/owned-card-list'

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
    query = {include: 'avatar'}

    if !apiClient.params.admin
      query.simple = true

    apiClient.type('projects').get Object.assign {}, query, @props.location.query

  imagePromise: (project) ->
    Promise.resolve project.avatar_src or '/assets/simple-avatar.jpg'

  cardLink: (project) ->
    link = if !!project.redirect
      project.redirect
    else
      [owner, name] = project.slug.split('/')
      "/projects/#{owner}/#{name}"

    return link

  render: ->
    <OwnedCardList
      {...@props}
      translationObjectName="projectsPage"
      listPromise={@listProjects()}
      linkTo="projects"
      cardLink={@cardLink}
      heroClass="projects-hero"
      imagePromise={@imagePromise}
      skipOwner={true} />
