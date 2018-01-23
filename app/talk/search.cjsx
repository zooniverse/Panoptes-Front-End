React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
Paginator = require './lib/paginator'
resourceCount = require './lib/resource-count'
ProjectLinker = require './lib/project-linker'
Loading = require('../components/loading-indicator').default

`import ActiveUsers from './active-users';`
`import TalkSearchResult from './search-result';`
`import PopularTags from './popular-tags';`

TALK_SEARCH_ERROR_MESSAGE = 'There was an error with your search. Please try again.'
VALID_SEARCH_PARAMS = ['page', 'page_size', 'query', 'types', 'section']

filterObjectKeys = (object, validKeys) ->
  newObject = {}

  for key, value of object
    if validKeys.indexOf(key) > -1
      newObject[key] = value

  return newObject

module.exports = createReactClass
  displayName: 'TalkSearch'

  contextTypes:
    geordi: PropTypes.object
    router: PropTypes.object.isRequired

  goBack: (linkName) ->
    @context.router.goBack()
    @context.geordi?.logEvent
      type: linkName

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

    @context.router.push
      pathname: location.pathname
      query: nextQuery

  render: ->
    numberOfResults = @state.results.length

    <div className="talk-search">
      <button className="link-style" type="button" onClick={@goBack.bind this, 'search-back'}>
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
              <section>
                <PopularTags
                  header={<h3>Popular Tags:</h3>}
                  section={@props.section}
                  project={@props.project} />
              </section>

              <section>
                <ActiveUsers section={@props.section} project={@props.project} />
              </section>

              <section>
                <h3>Projects:</h3>
                <ProjectLinker />
              </section>
            </div>
          </div>
        </div>}
    </div>
