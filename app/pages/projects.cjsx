counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
apiClient = require 'panoptes-client/lib/api-client'
OwnedCardList = require '../components/owned-card-list'
{Link, Router} = require 'react-router'
Filmstrip = require '../components/filmstrip'
{PROJECT_SORTS} = require '../components/project-sorts'
{ProjectFilteringInterface} = require '../components/project-card-list'

counterpart.registerTranslations 'en',
  projectsPage:
    title: 'All Projects'
    countMessage: 'Showing %(pageStart)s-%(pageEnd)s of %(count)s projects found.'
    button: 'Get Started'
    notFoundMessage: 'Sorry, no projects found.'

ProjectsPage = React.createClass
  displayName: 'ProjectsPage'
  title: 'Projects'

  mixins: [TitleMixin]

  contextTypes:
    location: React.PropTypes.object
    history: React.PropTypes.object

  emptyPromise:
    then: ->
    catch: ->

  getDefaultProps: ->
    location:
      query:
        discipline: ProjectFilteringInterface.defaultProps.discipline
        page: ProjectFilteringInterface.defaultProps.page
        sort: ProjectFilteringInterface.defaultProps.sort

  updateQuery: (newParams) ->
    query = Object.assign {}, @props.location.query, newParams
    for key, value of query
      if value is ''
        delete query[key]
    newLocation = "?"
    for key,value of query
      newLocation += key + "=" + value + "&"
    if newLocation!="?"
      newLocation = newLocation.substring(0, newLocation.length-1)
    @props.history.replace '/projects'+newLocation

  render: ->
    {discipline, page, sort} = @props.location.query
    listingProps = {discipline, page, sort}
    <ProjectFilteringInterface {...listingProps} onChangeQuery={@updateQuery} />

module.exports = ProjectsPage
