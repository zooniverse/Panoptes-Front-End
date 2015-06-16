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

module.exports = React.createClass
  displayName: 'ProjectsPage'

  mixins: [TitleMixin]

  title: 'Projects'

  listProjects: ->
    query = Object.create @props.query ? {}
    query.private ?= false
    query.beta ?= true # Temporary
    query.approved ?= true

    apiClient.type('projects').get query

  render: ->
    <OwnedCardList
      translationObjectName="projectsPage"
      listPromise={@listProjects()}
      linkTo="projects"
      cardLink="project-home"
      heroClass="projects-hero"
      imageProperty="avatar" />
