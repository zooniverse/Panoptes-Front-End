React = require 'react'
{History} = require 'react-router'

updatePageQueryParam = (page) ->
  base_uri_length = document.baseURI.length
  has_params = !!window.location.search
  end_path_index = if has_params then location.href.indexOf('?') else location.href.length
  pathname = location.href.slice(base_uri_length - 1, end_path_index)
  @history.pushState(null, pathname, {page})

module?.exports = React.createClass
  displayName: 'Paginator'

  propTypes:
    pageCount: React.PropTypes.number
    page: React.PropTypes.number                  # page number
    onPageChange: React.PropTypes.func.isRequired # passed (page) on change
    firstAndLast: React.PropTypes.bool            # optional, add 'first' & 'last' buttons
    scrollOnChange: React.PropTypes.bool          # optional, scroll to top of page on change
    pageSelector: React.PropTypes.bool # show page selector?

  getDefaultProps: ->
    page: 1
    onPageChange: updatePageQueryParam
    firstAndLast: true
    pageSelector: true
    scrollOnChange: true
    previousLabel: <span><i className="fa fa-long-arrow-left" /> Previous</span>
    nextLabel: <span>Next <i className="fa fa-long-arrow-right" /></span>

  mixins: [History]

  setPage: (activePage) ->
    @props.onPageChange.call(this, activePage)
    window.scrollTo(0,0) if @props.scrollOnChange

  onClickNext: ->
    {pageCount, page} = @props
    @props.onClickNext?()

    nextPage = if page is pageCount then pageCount else page + 1
    @setPage(nextPage)

  onClickPrev: ->
    {pageCount, page} = @props
    @props.onClickPrev?()

    prevPage = if page is 1 then page else page - 1
    @setPage(prevPage)

  onSelectPage: (e) ->
    selectedPage = +@refs.pageSelect.value
    @setPage(selectedPage)

  pageOption: (n, i) ->
    <option key={i} value={n}>
      {n}
    </option>

  render: ->
    {page, pageCount} = @props

    <div className="paginator #{ @props.className }">
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
          onClick={=> @setPage(pageCount)}
          disabled={page is pageCount}>
          Last <i className="fa fa-fast-forward" />
        </button>}
    </div>
