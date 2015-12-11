React = require 'react'
{Link, State, Navigation} = require '@edpaget/react-router'
{DISCIPLINES} = require './disciplines'

module.exports = React.createClass

  displayName: 'Filmstrip'

  propTypes:
    increment: React.PropTypes.number
    filterOption: React.PropTypes.func

  getDefaultProps: ->
    filterCards: DISCIPLINES

  getInitialState: ->
    scrollPos: 0

  scrollLeft: ->
    @adjustPos(-@props.increment)

  scrollRight: ->
    @adjustPos(@props.increment)

  adjustPos: (increment) ->
    @innerwidth = @strip.getBoundingClientRect().width
    @viewportwidth = @viewport.getBoundingClientRect().width

    newPos = @state.scrollPos - increment
    offset = @viewportwidth - @innerwidth

    if(increment < 0)
      newPos = Math.min(newPos, 0)

    if(increment > 0)
      newPos = Math.max(newPos, offset)

    @setState(scrollPos: newPos)

  componentDidMount: ->
    @strip = @refs.strip.getDOMNode()
    @viewport = @refs.viewport.getDOMNode()
    @refs.filmstrip.getDOMNode().style.height = @strip.getBoundingClientRect().height + 'px'

  render: -> <div className='filmstrip' ref='filmstrip'>
			<button className='prevNav navButton' onClick={@scrollLeft}>&lt;</button>
			<div className='viewport' ref='viewport'>
				<div className='strip' ref='strip' style={left: @state.scrollPos}>
			      <div className={"filter"}>
			        <div className="discipline discipline-all" onClick={@props.filterOption.bind this, ""} >
			          <p>All<br/>Disciplines</p>
			        </div>
			        {for filter, i in @props.filterCards
			          filterName = filter.value.replace(" ", "-")
			          <div className={"discipline discipline-#{filterName}"} onClick={@props.filterOption.bind this, filter.value} >
			            <span key={i} className="icon icon-#{filterName}"></span>
			            <p>{filter.label}</p>
			          </div>
			        }
			      </div>
				</div>
			</div>
			<button className='nextNav navButton' onClick={@scrollRight}>&gt;</button>
		</div>
