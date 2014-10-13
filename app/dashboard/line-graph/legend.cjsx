# @cjsx React.DOM

React = require 'react'

module?.exports = React.createClass
  displayName: 'LineGraphLegend'

  itemWidth: 200
  itemHeight: 100
  circleSize: 10
  fill: "#fff"
  borderWidth: 2
  textFill: "darkgrey"
  iconWidth: 50 # percent

  propTypes:
    data: React.PropTypes.array # Array of objects with 'color' and 'text' keys

  lineIcon: (data, i) ->
    right = @iconRight()
    left = @iconLeft()

    <svg key={i} width={@itemWidth} height={@itemHeight} style={overflow: "auto", display: 'inline-block'}>
      <g>
        <line
          key={i}
          x1={left + "%"}
          y1={50 + "%"}
          x2={right + "%"}
          y2={50 + "%"}
          stroke={data.color}
          strokeWidth={@borderWidth}
        />
        <circle
          cx={left + "%"}
          cy={50 + "%"}
          r={@circleSize}
          fill={@fill}
          stroke={data.color}
          strokeWidth={@borderWidth}
        />
        <circle
          cx={right + "%"}
          cy={50 + "%"}
          r={@circleSize}
          fill={@fill}
          stroke={data.color}
          strokeWidth={@borderWidth}
        />
        <text
          x={50 + "%"}
          y={90 + "%"}
          fill={@textFill}
          style={textAnchor: 'middle'}>
         {data.text}
        </text>
      </g>
    </svg>

  render: ->
    items = @props.data.map(@lineIcon)

    <div style={textAlign: "center"}>
      {items}
    </div>

  iconLeft: ->
    (100 - @iconWidth) / 2

  iconRight: ->
    @iconWidth + @iconLeft()


