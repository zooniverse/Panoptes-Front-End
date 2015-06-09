React = require 'react'
{ Navigation } = require 'react-router'
talkClient = require '../api/talk'
Paginator = require './lib/paginator'
TalkSearchResult = require './search-result'
resourceCount = require './lib/resource-count'
Loading = require '../components/loading-indicator'

TALK_SEARCH_ERROR_MESSAGE = 'There was an error with your search. Please try again.'
VALID_SEARCH_PARAMS = ['page', 'page_size', 'query', 'types', 'section']

formTalkSearchParams = (object) ->
  params = []

  for key, val of object
    if Array.isArray(val)
      params.push "#{key}[]=#{val}"
    else
      params.push "#{key}=#{val}"

  return params.join '&'

status = (response) ->
  if (response.status >= 200 && response.status < 300)
    return response

  throw new Error

filterObjectKeys = (object, validKeys) ->
  newObject = {}

  for key, value of object
    if validKeys.indexOf(key) > -1
      newObject[key] = value

  return newObject

module.exports = React.createClass
  displayName: 'TalkSearch'
  mixins: [Navigation]

  getInitialState: ->
    errorThrown: false
    isLoading: true
    results: []
    resultsMeta: {}

  componentDidMount: ->
    @runSearchQuery filterObjectKeys @props.query, VALID_SEARCH_PARAMS

  componentWillReceiveProps: (nextProps) ->
    @runSearchQuery filterObjectKeys nextProps.query, VALID_SEARCH_PARAMS

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

    paramsToUse = Object.assign defaultParams, params

    params = formTalkSearchParams paramsToUse
    url = talkClient.root + "/searches?" + params

    fetch url, { method: 'get' }, talkClient.headers
      .then(status)
      .then (response) -> return response.json()
      .then ({ searches, meta }) =>
        discussionRequests = []
        for comment in searches
          do (comment) ->
            discussionRequests.push talkClient.type('discussions').get(comment.discussion_id.toString()).then (discussionResult) ->
              comment.discussion = discussionResult

        Promise.all(discussionRequests).then =>
          @setState
            results: searches
            resultsMeta: meta.searches
      .catch =>
        @setState errorThrown: true
      .then =>
        @setState isLoading: false

  onPageChange: (page) ->
    @goToPage page

  goToPage: (n) ->
    nextQuery = Object.assign @props.query, {page: n}
    @transitionTo @props.path, @props.params, nextQuery

  render: ->
    numberOfResults = @state.results.length

    <div className="talk-search">
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

          <div className="talk-search-results">
            {@state.results.map (result, i) ->
              <TalkSearchResult data={result} key={i} />}
            <Paginator page={+@state.resultsMeta.page} onPageChange={@onPageChange} pageCount={@state.resultsMeta.page_count} />
          </div>
        </div>}
    </div>
