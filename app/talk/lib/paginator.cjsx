React = require 'react'
{Navigation} = require 'react-router'

changeSearchString = (searchString, changes) ->
  params = {}
  if searchString isnt ""
    for keyValue in searchString.slice(1).split('&')
      [key, value] = keyValue.split('=')
      params[key] = value
  for key, value of changes
    params[key] = value
  params

updatePageQueryParam = (page) ->
  if process.env.NON_ROOT == 'true'
    [beforeQuestionMark, afterQuestionMark] = location.hash.split('?')
    oldSearch = '?' + afterQuestionMark
    newSearch = changeSearchString(oldSearch, {page})
    newSearch = "?#{([key, value].join('=') for key, value of newSearch when value?).join('&')}"
    location.hash = beforeQuestionMark + newSearch
  else
    newSearch = changeSearchString(location.search, {page})
    @transitionTo(@getPath(), {}, newSearch)

module?.exports = React.createClass
  displayName: 'Paginator'

  propTypes:
    pageCount: React.PropTypes.number
    page: React.PropTypes.number                  # page number
    onPageChange: React.PropTypes.func.isRequired # passed (page) on change
    firstAndLast: React.PropTypes.bool            # optional, add 'first' & 'last' buttons
    scrollOnChange: React.PropTypes.bool          # optional, scroll to top of page on change

  getDefaultProps: ->
    page: 1
    onPageChange: updatePageQueryParam
    firstAndLast: true
    scrollOnChange: true

  mixins: [Navigation]

  setPage: (activePage) ->
    @props.onPageChange.call(this, activePage)
    window.scrollTo(0,0) if @props.scrollOnChange

  onClickNext: ->
    {pageCount, page} = @props

    nextPage = if page is pageCount then pageCount else page + 1
    @setPage(nextPage)

  onClickPrev: ->
    {pageCount, page} = @props

    prevPage = if page is 1 then page else page - 1
    @setPage(prevPage)

  onSelectPage: (e) ->
    selectedPage = +@refs.pageSelect.getDOMNode().value
    @setPage(selectedPage)

  pageOption: (n, i) ->
    <option key={i} value={n}>
      {n}
    </option>

  render: ->
    {page, pageCount} = @props

    <div className="paginator">
      {if @props.firstAndLast
        <button
          className="paginator-first"
          onClick={=> @setPage(1)}
          disabled={page is 1}>
          <i className="fa fa-fast-backward" /> First
        </button>}

      <button
        className="paginator-prev"
        onClick={@onClickPrev}
        disabled={page is 1}>
        <i className="fa fa-long-arrow-left" /> Previous
      </button>

      <div className="paginator-page-selector">
        Page&nbsp;
        <select value={page} onChange={@onSelectPage} ref="pageSelect">
          {[1..pageCount].map(@pageOption)}
        </select> of {pageCount}
      </div>

      <button
        className="paginator-next"
        onClick={@onClickNext}
        disabled={page is pageCount}>
        Next <i className="fa fa-long-arrow-right" />
      </button>

      {if @props.firstAndLast
        <button
          className="paginator-last"
          onClick={=> @setPage(pageCount)}
          disabled={page is pageCount}>
          Last <i className="fa fa-fast-forward" />
        </button>}
    </div>
