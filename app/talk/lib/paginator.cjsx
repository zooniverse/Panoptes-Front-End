React = require 'react'

module?.exports = React.createClass
  displayName: 'Paginator'

  propTypes:
    pageCount: React.PropTypes.number
    page: React.PropTypes.number # page number
    onPageChange: React.PropTypes.func.isRequired # passed (page) on change

  getDefaultProps: ->
    page: 1

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
    <option
      key={i}
      value={n}
      selected={if @props.page is n then true else false}>
      {n}
    </option>

  render: ->
    <div className="paginator">
      <button
        className="paginator-prev"
        onClick={@onClickPrev}
        disabled={if @props.page is 1 then true else false}>
        <i className="fa fa-long-arrow-left" /> Previous
      </button>

      <div className="paginator-page-selector">
        Page&nbsp;
        <select onChange={@onSelectPage} ref="pageSelect">
          {[1..@props.pageCount].map(@pageOption)}
        </select> of {@props.pageCount}
      </div>

      <button
        className="paginator-next"
        onClick={@onClickNext}
        disabled={if @props.page is @props.pageCount then true else false}>
        Next <i className="fa fa-long-arrow-right" />
      </button>
    </div>
