counterpart = require 'counterpart'
React = require 'react'
{browserHistory} = require 'react-router'
TitleMixin = require '../lib/title-mixin'
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
    newLocation = Object.assign {}, @props.location, {query}
    newLocation.search = ""
    browserHistory.push newLocation

  render: ->
    {discipline, page, sort} = @props.location.query
    listingProps = {discipline, page, sort}
    <ProjectFilteringInterface {...listingProps} onChangeQuery={@updateQuery} />

module.exports = ProjectsPage
