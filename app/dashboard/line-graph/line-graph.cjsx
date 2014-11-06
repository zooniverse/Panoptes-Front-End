React = require 'react'
HoverBox = require './hover-box'
Line = require './line'
XAxis = require './x-axis'
XLabels = require './x-labels'
YRules = require './y-rules'
YLabels = require './y-labels'

module?.exports = React.createClass
  displayName: 'LineGraph'

  axisColor: 'lightgrey'

  propTypes:
    data: React.PropTypes.array         # Array of objects to plot
    xKey: React.PropTypes.string        # Key for x-values in each object
    yKeys: React.PropTypes.array        # Keys for y-values to plot in each object
    dataColors: React.PropTypes.array   # Colors for lines in yKeys
    pointRadius: React.PropTypes.number # Radius of circle on graph
    height: React.PropTypes.number      # Height of Graph
    yLines: React.PropTypes.number      # Number of y-axis horizontal rules
    yLabel: React.PropTypes.string      # Label for hover-box value

  getInitialState: ->
    circleHover: {x: 0, y: 0}

  coords: (yKey) ->
    dataMax = @dataMax()
    radiusPercent = @radiusPercent()
    xWidth = @percentWidth()

    @props.data.map (obj, i) =>
      {x: @xPercent(i, xWidth), y: @yPercent(obj[yKey], dataMax, radiusPercent), value: obj[yKey]}

  coordPairs: (yKey) ->
    coords = @coords(yKey)
    coords
      .map (coord, i) =>
        {coord1: coord, coord2: coords[i + 1]}
      .filter(@coordPairNotUndefined)

  line: (yKey, i) ->
    <Line
      {...@props}
      key={i}
      color={@props.dataColors[i]}
      coords={@coords(yKey)}
      coordPairs={@coordPairs(yKey)}
      onCircleMouseOver={@onCircleMouseOver}
      onCircleMouseOut={@onCircleMouseOut} />

  onCircleMouseOver: (e) ->
    position = e.target.getBoundingClientRect()
    dataValue = e.target.getAttribute('value')

    @setState circleHover: {x: +position.left, y: +position.top, content: "#{dataValue} #{@props.yLabel}"}

  onCircleMouseOut: (e) ->
    @setState circleHover: {}

  render: ->
    lines = @props.yKeys.map(@line)

    <div className='line-graph'>
      <svg width="100%" height={@props.height}>
        <YLabels {...@props} max={@dataMax()} />
        <g transform="scale(1,-1), translate(0, -#{@props.height})">
          <XAxis {...@props} color={@axisColor} ticks={@xAxisPercentages()}/>
          <YRules yLines={@props.yLines} height=@props.height />
          {lines}
        </g>
      </svg>

      <XLabels {...@props} />

      <HoverBox top={@state.circleHover.y} left={@state.circleHover.x}>
        {@state.circleHover.content}
      </HoverBox>
    </div>

  flatten: (arrayOfArrays) ->
    arrayOfArrays.reduce (flatArr, nestedArr) => flatArr.concat nestedArr

  allDataValues: ->
    # returns 1 dimensional array of all raw data values
    @flatten @props.yKeys.map (key) => @props.data.map (obj) =>
      obj[key] ? 0

  dataMax: ->
    Math.max @allDataValues()...

  xAxisPercentages: ->
    xWidth = @percentWidth()
    [0...@props.data.length].map (i) => @xPercent(i, xWidth)

  percentWidth: ->
    (1 / @props.data.length) * 100

  xPercent: (i, xWidth) ->
    # percentage width of x values
    xWidth * i + (xWidth / 2)

  radiusPercent: ->
    ((@props.pointRadius / @props.height) * 100) ? 0

  yPercent: (dataVal, dataMax, radiusPercent) ->
    # ensures circles are above x-axis line and inside the top of the graph
    # TODO: how to best handle extreme outliers?
    percentVal = (dataVal / dataMax) * 100
    (percentVal - ((percentVal / dataMax) * radiusPercent)) + radiusPercent

  coordPairNotUndefined: (p) ->
    p.coord1? and p.coord2?

