counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
apiClient = require 'panoptes-client/lib/api-client'
OwnedCardList = require '../components/owned-card-list'
{Link, Router} = require 'react-router'
Filmstrip = require '../components/filmstrip'
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

  emptyPromise:
    then: ->
    catch: ->

  getInitialState: ->
    viewingProjects: @emptyPromise
    query: @props.location.query

  setFilter: (tag) ->
    @onGridChange {tags: tag, page: 1}

  onGridChange: (query) ->
    urlQuery = Object.assign {}, @props.location.query, @state.query, query

    delete urlQuery.tags if urlQuery.tags == ''
    delete urlQuery.sort if urlQuery.sort == '' || urlQuery.sort == 'default'
    delete urlQuery.page if urlQuery.page == '1'

    @setState query: urlQuery, ->
      @context.history.pushState null, @props.location.pathname, urlQuery
      @fetchProjects()

  fetchProjects: ->
    apiQuery = Object.assign {}, @state.query, @apiOpts
    @setState viewingProjects: apiClient.type('projects').get apiQuery

  componentDidMount: ->
    @fetchProjects()

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
      skipOwner={true}>
      <Filmstrip increment={350} filterOption={@setFilter} selectedFilter={@state.query.tags}/>
    </OwnedCardList>
