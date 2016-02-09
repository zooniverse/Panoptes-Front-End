React = require 'react'
{History} = require 'react-router'
PromiseToSetState = require '../../lib/promise-to-set-state'
ChartistGraph = require 'react-chartist'
moment = require 'moment'
qs = require 'qs'
PromiseRenderer = require '../../components/promise-renderer'
config = require '../../api/config'
{Model, makeHTTPRequest} = require 'json-api-client'

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
    minIdx: Math.max Object.keys(@props.data).length - @props.num, 0
    maxIdx: Object.keys(@props.data).length - 1

  getDefaultProps: ->
    data: []
    options:
      axisX:
        offset: 90
        showGrid: false
      axisY:
        onlyInteger: true

  componentWillReceiveProps: (nextProps) ->
    newState =
      minIdx: Math.max Object.keys(nextProps.data).length - @props.num, 0
      maxIdx: Object.keys(nextProps.data).length - 1
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
    else if data.type == 'bar'
      data.element.attr({style: "stroke-width: #{100 / length}%"})

  getOptions: (type) ->
    optionsList = []
    switch type
      when 'min'
        @props.data.forEach ({label}, idx) =>
          if idx < @state.maxIdx
            optionsList.push(<option value={idx} key={"min-#{idx}"}>{@formatLabel[@props.by]?(label) ? label}</option>)
      when 'max'
        @props.data.forEach ({label}, idx) =>
          if idx > @state.minIdx
            optionsList.push(<option value={idx} key={"max-#{idx}"}>{@formatLabel[@props.by]?(label) ? label}</option>)
    optionsList

  selectChange: (event) ->
    newState = {}
    newState[event.target.id] = event.target.value
    @setState(newState)

  render: ->
    data =
      labels: []
      series: [[]]

    # minIdx = Object.keys(@props.data).length - @props.num
    @props.data.forEach ({label, value}, idx) =>
      if (idx >= @state.minIdx & idx <= @state.maxIdx)
        data.labels.push @formatLabel[@props.by]?(label) ? label
        data.series[0].push value

    #console.log(@state.maxIdx - @state.minIdx + 1)
    listener =
      draw: @onDraw

    <div className="svg-container">
      <select value={@state.minIdx} onChange={@selectChange} id="minIdx">
        {@getOptions('min')}
      </select>
      <select value={@state.maxIdx} onChange={@selectChange} id="maxIdx">
        {@getOptions('max')}
      </select>
      <br />
      <ChartistGraph className="ct-major-tenth" listener={listener} type="Bar" data={data} options={@props.options} />
    </div>


WorkflowProgress = React.createClass
  render: ->
    <div className="progress-element">
      <div className="flex-wrapper">
        <h3>{@props.workflow.display_name}</h3>
        <div>
          Retirement limit: {@props.workflow.retirement.options.count.toLocaleString()}
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
    classificationsBy: 'hour'
    volunteersBy: 'hour'

  classification_count: (period) ->
    stats_url = "#{config.statHost}/counts/classification/#{period}?project_id=#{@props.projectId}"
    makeHTTPRequest 'GET', stats_url
      .then (response) =>
        results = JSON.parse response.responseText
        bucket_data = results["events_over_time"]["buckets"]
        data = bucket_data.map (stat_object) =>
          label: stat_object.key_as_string
          value: stat_object.doc_count
      .catch (response) ->
        console?.error 'Failed to get the stats'

  volunteer_count: (period) ->
    []

  workflowInfo: ->
    progress = []
    for workflow, key in @props.workflows
      if workflow?
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
        Classifications per{' '}
        <select value={@props.classificationsBy} onChange={@handleGraphChange.bind this, 'classifications'}>
          <option value="hour">hour</option>
          <option value="day">day</option>
          <option value="week">week</option>
          <option value="month">month</option>
        </select><br />
        <PromiseRenderer promise={@classification_count(@props.classificationsBy)}>{(classificationData) =>
          <Graph data={classificationData} by={@props.classificationsBy} num={24} />
        }</PromiseRenderer>
      </div>
    </div>

  handleGraphChange: (which, e) ->
    @props.handleGraphChange(which, e)

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
      classificationsBy: @getQuery('classifications') ? 'hour'
      volunteersBy: @getQuery('valunteerss') ? 'hour'
      projectId: @props.project.id
      totalVolunteers: @props.project.classifiers_count
      currentVolunteers: @props.project.activity
      workflows: @state.workflowList
      startDate: @props.project.launch_date

    <ProjectStatsPage {...queryProps} />

module.exports = ProjectStatsPageController
