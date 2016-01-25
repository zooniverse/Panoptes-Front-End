counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
apiClient = require 'panoptes-client/lib/api-client'
OwnedCardList = require '../components/owned-card-list'
{Link, Router} = require 'react-router'

{PROJECT_SORTS} = require '../components/project-sorts'

counterpart.registerTranslations 'en',
  projectsPage:
    title: 'All Projects'
    countMessage: 'Showing %(pageStart)s-%(pageEnd)s of %(count)s found.'
    button: 'Get Started'
    notFoundMessage: 'Sorry, no projects found'

module.exports = React.createClass
  displayName: 'ProjectsPage'
  title: 'Projects'

  mixins: [TitleMixin]

  contextTypes:
    location: React.PropTypes.object
    history: React.PropTypes.object

  getInitialState: ->
    return viewingProjects:
        then: ->
        catch: ->

  onGridChange: (query) ->
    thisQuery = Object.assign {}, @props.location.query, query
    thisQuery.include = 'avatar'
    thisQuery.cards = true
    thisQuery.launch_approved = !apiClient.params.admin

    delete thisQuery.tags if thisQuery.tags == ''
    delete thisQuery.sort if thisQuery.sort == '' || thisQuery.sort == 'default'

    @context.history.pushState null, @props.location.pathname, thisQuery
    @setState viewingProjects: apiClient.type('projects').get thisQuery

  imagePromise: (project) ->
    src = if project.avatar_src
      "//#{ project.avatar_src }"
    else
      './assets/simple-avatar.jpg'
    Promise.resolve src

  cardLink: (project) ->
    link = if !!project.redirect
      project.redirect
    else
      [owner, name] = project.slug.split('/')
      "/projects/#{owner}/#{name}"

    return link

  searchByName: (value, callback) ->
    return callback null, { options: [] } if value is ''
    apiClient.type('projects').get(search: "#{value}", page_size: 10)
      .then (projects) =>
        opts = projects.map (project) ->
          {
            value: project.id,
            label: project.display_name,
            project: project
          }

        callback null, {
          options: opts
        }
  navigateToProject: (projectID) ->
    apiClient.type('projects').get(projectID)
      .then (project) =>
        if project.redirect?
          window.location.href = project.redirect
        else
          [owner, name] = project.slug.split('/')
          @transitionTo 'project-home', owner: owner, name: name

  render: ->
    <OwnedCardList
      {...@props}
      translationObjectName="projectsPage"
<<<<<<< 42b3f1df8f7a5cb489788539a77d2078de17d46d
      listPromise={@listProjects()}
=======
>>>>>>> got paging working again, now i just need to restore the history function
      linkTo="projects"

      contents={@state.viewingProjects}

      onGridChange={@onGridChange}
      onSearch={query: @searchByName, navigate: @navigateToProject}
      sortOptions={PROJECT_SORTS}

      cardLink={@cardLink}
      heroClass="projects-hero"
      imagePromise={@imagePromise}
      skipOwner={true} />
