React = require 'react'
{Link, State, Navigation} = require '@edpaget/react-router'
{DISCIPLINES} = require './disciplines'

module.exports = React.createClass

  displayName: 'Filmstrip'

  propTypes:
    increment: React.PropTypes.number

  getDefaultProps: ->
    filterCards: DISCIPLINES

  getInitialState: ->
    scrollPos: 0
    selectedFilter: ''

  scrollLeft: ->
    @adjustPos(-@props.increment)

  scrollRight: ->
    @adjustPos(@props.increment)

  mangleFilterName: (filterName) ->
    filterName.replace(/\s+/g,'-')

  selectFilter: (filterName) ->
    @props.filterOption filterName
    @setState(selectedFilter: @mangleFilterName(filterName))

  calculateClasses: (filterName)->
    filterName = @mangleFilterName(filterName)
    list = ['discipline']
    list.push "discipline-#{filterName}"
    if(@state.selectedFilter == filterName)
      list.push 'active'
    if(@state.selectedFilter == '' && filterName == 'all')
      list.push 'active'
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
    @strip = @refs.strip.getDOMNode()
    @viewport = @refs.viewport.getDOMNode()
    @refs.filmstrip.getDOMNode().style.height = @strip.getBoundingClientRect().height + 'px'

  render: -> <div className='filmstrip' ref='filmstrip'>
			<button className='prevNav navButton' onClick={@scrollLeft}>&lt;</button>
			<div className='viewport' ref='viewport'>
				<div className='strip' ref='strip' style={left: @state.scrollPos}>
			      <div className={"filter"}>
			        <div className={@calculateClasses('all')} onClick={@selectFilter.bind this, ''} >
			          <p>All<br/>Disciplines</p>
			        </div>
			        {for filter, i in @props.filterCards
			          filterName = filter.value.replace(' ', '-')
			          <div className={@calculateClasses(filter.value)} onClick={@selectFilter.bind this, filter.value} >
			            <span key={i} className="icon icon-#{filterName}"></span>
			            <p>{filter.label}</p>
			          </div>
			        }
			      </div>
				</div>
			</div>
			<button className='nextNav navButton' onClick={@scrollRight}>&gt;</button>
		</div>
