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
    data = this.processData(@props.data, @props.by)
    min = Math.max data.labels.length - @props.num, 0
    max = data.labels.length - 1
    state = @processRange(min, max)
    state['data'] = data
    state

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

  processData: (inputData, binBy) ->
    data =
      labels: []
      series: [[]]

    previousLabel = ''
    inputData.forEach ({label, value}, idx) =>
      if idx > 0
        # fill in bins with zero as a value
        difference = Math.floor(moment.duration(moment(label).diff(moment(previousLabel)))[@formatDiff[binBy]]())
        if difference > 1
          for jdx in [1...difference]
            shouldBe = moment(previousLabel).add(jdx, "#{binBy}s").format()
            data.labels.push @formatLabel[binBy]?(shouldBe) ? shouldBe
            data.series[0].push 0
      data.labels.push @formatLabel[binBy]?(label) ? label
      data.series[0].push value
      previousLabel = label
    data

  processRange: (min, max) ->
    minIdx = @props.range[0] ? min
    maxIdx = @props.range[1] ? max
    midIdx = minIdx + maxIdx
    {minIdx, maxIdx, midIdx}

  componentWillReceiveProps: (nextProps) ->
    if this.props.data != nextProps.data
      data = this.processData(nextProps.data, nextProps.by)
      min = Math.max data.labels.length - @props.num, 0
      max = data.labels.length - 1
      newState = @processRange(min, max)
      newState['data'] = data
      @setState(newState)

  formatDiff:
    hour: 'asHours'
    day: 'asDays'
    week: 'asWeeks'
    month: 'asMonths'

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
      style = "stroke-width: #{100 / @state.data.labels.length}%"
      if (data.index >= @state.minIdx & data.index <= @state.maxIdx)
        style += '; stroke: #f78d27'
      data.element.attr({style: style})

  onSlide: (event) ->
    newState =
      minIdx: event[0]
      maxIdx: event[1]
      midIdx: event[1] + event[0]
    @setState(newState, @onRangeChange)

  onSlideMid: (event) ->
    diff = @state.maxIdx - @state.minIdx
    newState =
      minIdx: Math.floor (event - diff) / 2
      maxIdx: Math.floor (event + diff) / 2
      midIdx: event
    if newState.minIdx >= 0 & newState.maxIdx < @state.data.labels.length
      @setState(newState, @onRangeChange)
      
  onRangeChange: (event) ->
    @props.handleRangeChange("#{@state.minIdx},#{@state.maxIdx}")

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
