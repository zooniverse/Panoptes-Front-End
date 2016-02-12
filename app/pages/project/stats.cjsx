React = require 'react'
{History} = require 'react-router'
PromiseToSetState = require '../../lib/promise-to-set-state'
ChartistGraph = require 'react-chartist'
moment = require 'moment'
qs = require 'qs'
PromiseRenderer = require '../../components/promise-renderer'
config = require '../../api/config'
{Model, makeHTTPRequest} = require 'json-api-client'

# hack to make browserify and rc-slider play nice
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
        style += '; stroke: darkred'
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

GraphSelect = React.createClass
  getDefaultProps: ->
    by: 'hour'

  shouldComponentUpdate: (nextProps) ->
    return @props.by isnt nextProps.by

  statCount: (period, type) ->
    stats_url = "#{config.statHost}/counts/#{type}/#{period}?project_id=#{@props.projectId}"
    makeHTTPRequest 'GET', stats_url
      .then (response) =>
        results = JSON.parse response.responseText
        bucket_data = results["events_over_time"]["buckets"]
        data = bucket_data.map (stat_object) =>
          label: stat_object.key_as_string
          value: stat_object.doc_count
      .catch (response) ->
        console?.error 'Failed to get the stats'

  render: ->
    <div>
      {@props.type[0].toUpperCase() + @props.type.substring(1)}s per{' '}
      <select value={@props.by} onChange={@handleGraphChange.bind this, @props.type}>
        <option value="hour">hour</option>
        <option value="day">day</option>
        <option value="week">week</option>
        <option value="month">month</option>
      </select><br />
      <PromiseRenderer promise={@statCount(@props.by, @props.type)}>{(statData) =>
        <Graph data={statData} by={@props.by} num={24} />
      }</PromiseRenderer>
    </div>

  handleGraphChange: (which, e) ->
    @props.handleGraphChange(which, e)

WorkflowProgress = React.createClass
  render: ->
    if @props.workflow.retirement.criteria == 'classification_count'
      retirement = <div>Retirement limit: {@props.workflow.retirement.options.count.toLocaleString()}</div>
    <div className="progress-element">
      <div className="flex-wrapper">
        <h3>{@props.workflow.display_name}</h3>
        <div>
          {retirement}
        </div>
        <div>
          Images retired: {@props.workflow.retired_set_member_subjects_count.toLocaleString()} / {@props.workflow.subjects_count.toLocaleString()}
        </div>
        <div>
          Classifications: {@props.workflow.classifications_count.toLocaleString()} / {(@props.workflow.subjects_count * @props.workflow.retirement.options.count).toLocaleString()}
        </div>
        <Progress progress={@props.workflow.completeness} />
      </div>
    </div>

ProjectStatsPage = React.createClass
  getDefaultProps: ->
    totalClassifications: 0
    requiredClassifications: 0
    totalVolunteers: 2
    currentVolunteers: 46

  workflowInfo: ->
    progress = []
    for workflow, key in @props.workflows
      if workflow?.active
        progress.push(<WorkflowProgress key={key} workflow={workflow} />)
    progress

  render: ->
    progress = @workflowInfo()
    if @props.startDate
      start = <div>Launch Date: {moment(@props.startDate).format 'MMM-DD-YYYY'}</div>
    <div className="project-stats-page content-container">
      <div className="project-stats-dashboard">
        {start}
        <div>
          Volunteers: {@props.totalVolunteers.toLocaleString()}
        </div>
        <div>
          Online now: {@props.currentVolunteers.toLocaleString()}
        </div>
        <hr />
        <div className="project-stats-progress">
          {progress}
        </div>
        <hr />
      </div>

      <div>
        <GraphSelect handleGraphChange={@props.handleGraphChange} type="classification" projectId={@props.projectId} by={@props.classificationsBy}/>
      </div>
      <div>
        <GraphSelect handleGraphChange={@props.handleGraphChange} type="comment" projectId={@props.projectId} by={@props.commentsBy}/>
      </div>

    </div>

ProjectStatsPageController = React.createClass
  mixins: [History, PromiseToSetState]

  getInitialState: ->
    workflowList: (null for [1..@props.project.links.workflows.length])

  componentDidMount: ->
    for workflowID, idx in @props.project.links.workflows
      @getWorkflow(workflowID, idx);

  handleGraphChange: (which, e) ->
    query = qs.parse location.search.slice 1
    query[which] = e.target.value
    {owner, name} = @props.params
    @history.pushState(null, "/projects/#{owner}/#{name}/stats/", query)

  getQuery: (which) ->
    qs.parse(location.search.slice(1))[which]

  getWorkflow: (workflowID, idx) ->
    @props.project.get('workflows', id: workflowID).then ([workflow]) =>
      unless workflow?
        throw new Error "No workflow #{workflowID} for project #{@props.project.id}"
      currentList = @state.workflowList
      currentList[idx] = workflow
      @setState({workflowList: currentList})

  render: ->
    queryProps =
      handleGraphChange: @handleGraphChange
      classificationsBy: @getQuery('classification') ? 'hour'
      commentsBy: @getQuery('comment') ? 'hour'
      projectId: @props.project.id
      totalVolunteers: @props.project.classifiers_count
      currentVolunteers: @props.project.activity
      workflows: @state.workflowList
      startDate: @props.project.launch_date

    <ProjectStatsPage {...queryProps} />

module.exports = ProjectStatsPageController
