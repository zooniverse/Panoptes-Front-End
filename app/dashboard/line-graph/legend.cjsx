React = require 'react'

module?.exports = React.createClass
  displayName: 'LineGraphLegend'

  circleSize: 10
  iconWidth: 50 # percent

  propTypes:
    data: React.PropTypes.array # Array of objects with 'color' and 'text' keys

  lineIcon: (data, i) ->
    right = @iconRight()
    left = @iconLeft()

    <svg key={i} width={@itemWidth} height={@itemHeight} >
      <g>
        <line
          key={i}
          x1={left + "%"}
          y1={50 + "%"}
          x2={right + "%"}
          y2={50 + "%"}
          stroke={data.color}
        />
        <circle
          cx={left + "%"}
          cy={50 + "%"}
          r={@circleSize}
          stroke={data.color}
        />
        <circle
          cx={right + "%"}
          cy={50 + "%"}
          r={@circleSize}
          stroke={data.color}
        />
        <text
          x={50 + "%"}
          y={90 + "%"}>
         {data.text}
        </text>
      </g>
    </svg>

  render: ->
    items = @props.data.map(@lineIcon)

    <div className="line-graph-legend">{items}</div>

  iconLeft: ->
    (100 - @iconWidth) / 2

  iconRight: ->
    @iconWidth + @iconLeft()


