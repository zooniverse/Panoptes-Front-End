React = require 'react'
{History} = require 'react-router'
updateQueryParams = require './update-query-params'

module?.exports = React.createClass
  displayName: 'Paginator'

  propTypes:
    pageCount: React.PropTypes.number
    page: React.PropTypes.number                  # page number
    onPageChange: React.PropTypes.func.isRequired # passed (page) on change
    firstAndLast: React.PropTypes.bool            # optional, add 'first' & 'last' buttons
    scrollOnChange: React.PropTypes.bool          # optional, scroll to top of page on change
    pageSelector: React.PropTypes.bool            # show page selector?
    pageKey: React.PropTypes.string               # optional name for key param (defaults to 'page')

  getDefaultProps: ->
    page: 1
    pageKey: 'page'
    onPageChange: (page) ->
      queryChange = { }
      queryChange[@props.pageKey] = page
      updateQueryParams @history, queryChange
    firstAndLast: true
    pageSelector: true
    scrollOnChange: true
    previousLabel: <span><i className="fa fa-long-arrow-left" /> Previous</span>
    nextLabel: <span>Next <i className="fa fa-long-arrow-right" /></span>

  mixins: [History]

  contextTypes:
    geordi: React.PropTypes.object

  addAvailableData: (data) ->
    if @props.collection?
      data.collection = @props.collection.slug
    data

  componentDidMount: ->
    @logClick = @context.geordi.makeHandler 'change-page'

  setPage: (activePage) ->
    @props.onPageChange.call(this, activePage)
    window.scrollTo(0,0) if @props.scrollOnChange

  onClickNext: ->
    @context.geordi?.logEvent
      type: 'change-page'
      relatedID: 'next-page'
      data: @addAvailableData {page:@props[@props.pageKey]}
    {pageCount} = @props
    page = @props[@props.pageKey]
    @props.onClickNext?()

    nextPage = if page is pageCount then pageCount else page + 1
    @setPage(nextPage)

  onClickPrev: ->
    @context.geordi?.logEvent
      type: 'change-page'
      relatedID: 'previous-page'
      data: @addAvailableData {page:@props[@props.pageKey]}
    page = @props[@props.pageKey]
    @props.onClickPrev?()

    prevPage = if page is 1 then page else page - 1
    @setPage(prevPage)

  onSelectPage: (e) ->
    @context.geordi?.logEvent
      type: 'change-page'
      relatedID: 'select-page'
      data: @addAvailableData {page:@refs.pageSelect.value}
    selectedPage = +@refs.pageSelect.value
    @setPage(selectedPage)

  pageOption: (n, i) ->
    <option key={i} value={n}>
      {n}
    </option>

  render: ->
    {pageCount} = @props
    page = @props[@props.pageKey]

    <div className="paginator #{ @props.className }">
      {if @props.firstAndLast
        <button
          className="paginator-first"
          onClick={=>
            @setPage(1);
            @context.geordi?.logEvent
              type: 'change-page'
              relatedID: 'first-page'
              data: @addAvailableData {page:1}
          }
          disabled={page is 1}>
          <i className="fa fa-fast-backward" /> First
        </button>}

      <button
        className="paginator-prev"
        onClick={@onClickPrev}
        disabled={page is 1}>
        {@props.previousLabel}
      </button>

      {if @props.pageSelector
        <div className="paginator-page-selector">
          Page&nbsp;
          <select value={page} onChange={@onSelectPage} ref="pageSelect">
            {[1..pageCount].map(@pageOption)}
          </select> of {pageCount}
        </div>
        }

      <button
        className="paginator-next"
        onClick={@onClickNext}
        disabled={page is pageCount}>
        {@props.nextLabel}
      </button>

      {if @props.firstAndLast
        <button
          className="paginator-last"
          onClick={=>
            @setPage(pageCount);
            @context.geordi?.logEvent
              type: 'change-page'
              relatedID: 'last-page'
              data: @addAvailableData {page:pageCount}
          }
          disabled={page is pageCount}>
          Last <i className="fa fa-fast-forward" />
        </button>}
    </div>
