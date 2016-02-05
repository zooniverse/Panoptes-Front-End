React = require 'react'
{History} = require 'react-router'
talkClient = require 'panoptes-client/lib/talk-client'
Paginator = require './lib/paginator'
TalkSearchResult = require './search-result'
resourceCount = require './lib/resource-count'
Loading = require '../components/loading-indicator'
PopularTags = require './popular-tags'
ActiveUsers = require './active-users'
ProjectLinker = require './lib/project-linker'
SidebarNotifications = require './lib/sidebar-notifications'

TALK_SEARCH_ERROR_MESSAGE = 'There was an error with your search. Please try again.'
VALID_SEARCH_PARAMS = ['page', 'page_size', 'query', 'types', 'section']

filterObjectKeys = (object, validKeys) ->
  newObject = {}

  for key, value of object
    if validKeys.indexOf(key) > -1
      newObject[key] = value

  return newObject

module.exports = React.createClass
  displayName: 'TalkSearch'
  mixins: [History]

  getInitialState: ->
    errorThrown: false
    isLoading: true
    results: []
    resultsMeta: {}

  componentDidMount: ->
    @runSearchQuery filterObjectKeys @props.location.query, VALID_SEARCH_PARAMS

  componentWillReceiveProps: (nextProps) ->
    if @props.location.query isnt nextProps.location.query
      @runSearchQuery filterObjectKeys nextProps.location.query, VALID_SEARCH_PARAMS

  runSearchQuery: (params) ->
    @setState
      errorThrown: false
      isLoading: true
      results: []

    defaultParams =
      section: @props.section
      types: ['comments']
      page: 1
      page_size: 10

    paramsToUse = Object.assign {}, defaultParams, params

    talkClient.type('searches').get(paramsToUse).then (searches) =>
      @setState
        results: searches
        resultsMeta: searches[0]?.getMeta('searches')
    .catch (e) =>
      @setState errorThrown: true
    .then =>
      @setState isLoading: false

  onPageChange: (page) ->
    @goToPage page

  goToPage: (n) ->
    nextQuery = Object.assign {}, @props.location.query, {page: n}

    @history.pushState(null, location.pathname, nextQuery)

  render: ->
    numberOfResults = @state.results.length

    <div className="talk-search">
      <button  className="link-style" type="button" onClick={@history.goBack}>
        <i className="fa fa-backward" /> Back
      </button>

      {if @state.isLoading
        <Loading />}

      {if @state.errorThrown
        <p className="form-help error">{TALK_SEARCH_ERROR_MESSAGE}</p>}

      {if !@state.isLoading && numberOfResults == 0 && !@state.errorThrown
        <p>No results found.</p>}

      {if !@state.isLoading && numberOfResults > 0
        <div className="talk-search-container">
          <div className="talk-search-counts">
            Your search returned {resourceCount @state.resultsMeta.count, 'results'}.
          </div>

          <div className="talk-list-content">
            <section className="talk-search-results">
              {@state.results.map (result, i) =>
                <TalkSearchResult {...@props} data={result} key={i} />}
              <Paginator page={+@state.resultsMeta.page} onPageChange={@onPageChange} pageCount={@state.resultsMeta.page_count} />
            </section>

            <div className="talk-sidebar">
              <SidebarNotifications {...@props} />

              <section>
                <PopularTags
                  header={<h3>Popular Tags:</h3>}
                  section={@props.section}
                  project={@props.project} />
              </section>

              <section>
                <ActiveUsers section={@props.section} />
              </section>

              <section>
                <h3>Projects:</h3>
                <ProjectLinker />
              </section>
            </div>
          </div>
        </div>}
    </div>
