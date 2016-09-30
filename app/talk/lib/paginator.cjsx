React = require 'react'
updateQueryParams = require './update-query-params'

module.exports = React.createClass
  displayName: 'Paginator'

  propTypes:
    pageCount: React.PropTypes.number
    page: React.PropTypes.number                  # page number
    onPageChange: React.PropTypes.func.isRequired # passed (page) on change
    firstAndLast: React.PropTypes.bool            # optional, add 'first' & 'last' buttons
    pageSelector: React.PropTypes.bool            # show page selector?
    pageKey: React.PropTypes.string               # optional name for key param (defaults to 'page')

  contextTypes:
    geordi: React.PropTypes.object
    router: React.PropTypes.object.isRequired

  getDefaultProps: ->
    page: 1
    pageKey: 'page'
    onPageChange: (page) ->
      queryChange = { }
      queryChange[@props.pageKey] = page
      updateQueryParams @context.router, queryChange
    firstAndLast: true
    pageSelector: true
    previousLabel: <span><i className="fa fa-long-arrow-left" /> Previous</span>
    nextLabel: <span>Next <i className="fa fa-long-arrow-right" /></span>

  componentDidMount: ->
    @logClick = @context.geordi?.makeHandler 'change-page'

  componentWillReceiveProps: (nextProps, nextContext)->
    @logClick = nextContext?.geordi?.makeHandler? 'change-page'

  setPage: (activePage) ->
    @props.onPageChange.call(this, activePage)

  onClickNext: ->
    @logClick 'next-page'
    {pageCount} = @props
    page = @props[@props.pageKey]
    @props.onClickNext?()

    nextPage = if page is pageCount then pageCount else page + 1
    @setPage(nextPage)

  onClickPrev: ->
    @logClick 'previous-page'
    page = @props[@props.pageKey]
    @props.onClickPrev?()

    prevPage = if page is 1 then page else page - 1
    @setPage(prevPage)

  onSelectPage: (e) ->
    @logClick 'select-page'
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
          onClick={=> @setPage(1); @logClick 'first-page'}
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
          onClick={=> @setPage(pageCount); @logClick 'last-page'}
          disabled={page is pageCount}>
          Last <i className="fa fa-fast-forward" />
        </button>}
    </div>
