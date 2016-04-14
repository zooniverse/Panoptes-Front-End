React = require 'react'
{Link, State, Navigation} = require 'react-router'
{DISCIPLINES} = require './disciplines'

module.exports = React.createClass

  displayName: 'Filmstrip'

  propTypes:
    increment: React.PropTypes.number.isRequired
    onChange: React.PropTypes.func.isRequired

  getDefaultProps: ->
    filterCards: DISCIPLINES

  getInitialState: ->
    scrollPos: 0

  scrollLeft: ->
    @adjustPos(-@props.increment)

  scrollRight: ->
    @adjustPos(@props.increment)

  mangleFilterName: (filterName) ->
    filterName.replace(/\s+/g,'-')

  selectFilter: (filterName) ->
    @props.onChange filterName

  calculateClasses: (filterName)->
    mangledFilterName = @mangleFilterName(filterName)

    list = ['filmstrip--disciplines__discipline-card']
    list.push "filmstrip--disciplines__discipline-card--discipline-#{mangledFilterName}"

    if(@props.value== filterName)
      list.push 'filmstrip--disciplines__discipline-card--active'
    if(!@props.value? && filterName == 'all')
      list.push 'filmstrip--disciplines__discipline-card--active'
    if(@props.value== '' && filterName == 'all')
      list.push 'filmstrip--disciplines__discipline-card--active'

    return list.join ' '

  adjustPos: (increment) ->
    @innerwidth = @strip.getBoundingClientRect().width
    @viewportwidth = @viewport.getBoundingClientRect().width

    newPos = @state.scrollPos - increment
    offset = @viewportwidth - @innerwidth

    if(increment < 0)
      newPos = Math.min(newPos, 0)

    if(increment > 0)
      newPos = Math.max(newPos, offset)

    @setState scrollPos: newPos

  componentDidMount: ->
    @strip = @refs.strip
    @viewport = @refs.viewport
    @refs.filmstrip.style.height = @strip.getBoundingClientRect().height + 'px'

  render: -> <div className='filmstrip filmstrip--disciplines' ref='filmstrip'>
      <button className='filmstrip__nav-btn' onClick={@scrollLeft} role="presentation" aria-hidden="true" aria-label="Scroll Left"><i className="fa fa-chevron-left"></i></button>
      <div className='filmstrip__viewport' ref='viewport'>
        <div className='filmstrip__strip' ref='strip' style={left: @state.scrollPos}>
            <ul>
              <li>
                <button className={@calculateClasses('all')} onClick={@selectFilter.bind this, ''} >
                  <p>All<br/>Disciplines</p>
                </button>
              </li>
              {for filter, i in @props.filterCards
                filterName = filter.value.replace(' ', '-')
                <li key={i}>
                  <button key={i} className={@calculateClasses(filter.value)} onClick={@selectFilter.bind this, filter.value} >
                    <span key={i} className="filmstrip--disciplines__discipline-card__icon filmstrip--disciplines__discipline-card__icon-#{filterName}"></span>
                    <p>{filter.label}</p>
                  </button>
                </li>
              }
            </ul>
        </div>
      </div>
      <button className='filmstrip__nav-btn' onClick={@scrollRight} role="presentation" aria-hidden="true" aria-label="Scroll Right"><i className="fa fa-chevron-right"></i></button>
    </div>
