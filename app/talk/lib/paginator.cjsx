React = require 'react'

module?.exports = React.createClass
  displayName: 'Paginator'

  propTypes:
    pageCount: React.PropTypes.number
    page: React.PropTypes.number                  # page number
    onPageChange: React.PropTypes.func.isRequired # passed (page) on change
    firstAndLast: React.PropTypes.bool            # Optional, add 'first' & 'last' buttons

  getDefaultProps: ->
    page: 1
    firstAndLast: true

  setPage: (activePage) ->
    @props.onPageChange(activePage)

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
