React = require 'react'
ChartistGraph = require 'react-chartist'
moment = require 'moment'

# hack to make browserify and rc-slider play nice when using window shim
document.createElement ?= (input) ->
  style: {}
Rcslider = require 'rc-slider'

Progress = React.createClass
  getDefaultProps: ->
    progress: 0
    options:
      donut: true
      donutWidth: '20%'
      startAngle: 0
      total: 1
      showLabel: false

  render: ->
    percent = @props.progress * 100
    data =
      series: [@props.progress, 1 - @props.progress]

    <div className="svg-container progress-container">
      <span className="progress-label">{"#{percent.toFixed(0)}% Complete"}</span>
      <ChartistGraph className="ct-square" type="Pie" data={data} options={@props.options} />
    </div>

Graph = React.createClass
  getInitialState: ->
    data =
      labels: []
      series: [[]]

    @props.data.forEach ({label, value}, idx) =>
      data.labels.push @formatLabel[@props.by]?(label) ? label
      data.series[0].push value

    min = Math.max data.labels.length - @props.num, 0
    max = data.labels.length - 1

    minIdx: min
    maxIdx: max
    midIdx: max + min
    data: data

  getDefaultProps: ->
    data: []
    options:
      axisX:
        offset: 90
        showGrid: false
      axisY:
        onlyInteger: true
    optionsSmall:
      axisX:
        offset: 0
        showLabel: false
        showGrid: false
      axisY:
        offset: 0
        showLabel: false
        showGrid: false
      width: '100%'
      height: '50px'
      chartPadding:
        top: 0
        right: 15
        bottom: 0
        left: 15

  componentWillReceiveProps: (nextProps) ->
    data =
      labels: []
      series: [[]]

    nextProps.data.forEach ({label, value}, idx) =>
      data.labels.push @formatLabel[nextProps.by]?(label) ? label
      data.series[0].push value

    min = Math.max data.labels.length - @props.num, 0
    max = data.labels.length - 1

    newState =
      minIdx: min
      maxIdx: max
      midIdx: max + min
      data: data
    @setState(newState)

  formatLabel:
    hour: (date) -> moment(date).format 'MMM-DD hh:mm A'
    day: (date) -> moment(date).format 'MMM-DD-YYYY'
    week: (date) -> moment(date).format 'MMM-DD-YYYY'
    month: (date) -> moment(date).format 'MMM-DD-YYYY'

  onDraw: (data) ->
    length = @state.maxIdx - @state.minIdx + 1
    if data.type == 'label'
      if data.axis.units.dir == 'horizontal'
        svgWidth = data.element.parent().parent().width()
        width = (svgWidth - 65) / length
        dx = width / 2 + (100 - width)
        data.element.attr({x: data.element.attr('x') - dx})
        # number of bars that fit insdie an axis label (17px)
        numberBars = Math.ceil 17 / width
        if data.index % numberBars
          data.element.attr({style: "display: none"})
    else if data.type == 'bar'
      data.element.attr({style: "stroke-width: #{100 / length}%"})

  onDrawSmall: (data) ->
    if data.type == 'bar'
      style = "stroke-width: #{100 / Object.keys(@props.data).length}%"
      if (data.index >= @state.minIdx & data.index <= @state.maxIdx)
        style += '; stroke: #f78d27'
      data.element.attr({style: style})

  onSlide: (event) ->
    newState =
      minIdx: event[0]
      maxIdx: event[1]
      midIdx: event[1] + event[0]
    @setState(newState)

  onSlideMid: (event) ->
    diff = @state.maxIdx - @state.minIdx
    newState =
      minIdx: Math.floor (event - diff) / 2
      maxIdx: Math.floor (event + diff) / 2
      midIdx: event
    if newState.minIdx >= 0 & newState.maxIdx < @state.data.labels.length
      @setState(newState)

  render: ->
    dataSlice =
      labels: @state.data.labels.slice(@state.minIdx, @state.maxIdx + 1)
      series: [@state.data.series[0].slice(@state.minIdx, @state.maxIdx + 1)]

    if @state.data.labels.length > @props.num
      smallChart =
        <div>
          <ChartistGraph listener={draw: @onDrawSmall} type="Bar" data={@state.data} options={@props.optionsSmall} />
          <div className="top-slider">
            <Rcslider ref="top-slider" min={0} max={@state.data.labels.length - 1} range={true} allowCross={false} value={[@state.minIdx, @state.maxIdx]} tipFormatter={null} onChange={@onSlide} />
          </div>
          <div className="mid-slider">
            <Rcslider ref="mid-slider" min={0} max={2 * (@state.data.labels.length - 1)} value={@state.midIdx} step={2} included={false} tipFormatter={null} onChange={@onSlideMid} />
          </div>
          <br />
        </div>

    <div className="svg-container">
      {smallChart}
      <ChartistGraph className="ct-major-tenth" listener={draw: @onDraw} type="Bar" data={dataSlice} options={@props.options} />
    </div>

module.exports =
  Progress: Progress
  Graph: Graph
