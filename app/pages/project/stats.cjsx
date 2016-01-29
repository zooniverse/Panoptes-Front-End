React = require 'react'
{History} = require 'react-router'
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
      donutWidth: 35
      startAngle: 0
      total: 1
      showLabel: false

  render: ->
    percent = @props.progress * 100
    data =
      series: [@props.progress]

    <div className="svg-container progress-container">
      <span className="progress-label">{"#{percent.toFixed(0)}% Complete"}</span>
      <ChartistGraph className="ct-square" type="Pie" data={data} options={@props.options} />
    </div>


Graph = React.createClass
  getDefaultProps: ->
    data: []
    options:
      axisX:
        offset: 40
        showGrid: false
      axisY:
        onlyInteger: true

  formatLabel:
    hour: (date) -> moment(date).format 'MMM-DD hh:mm A'
    day: (date) -> moment(date).format 'MMM-DD-YYYY'
    week: (date) -> moment(date).format 'MMM-DD-YYYY'
    month: (date) -> moment(date).format 'MMM-DD-YYYY'

  render: ->
    data =
      labels: []
      series: [[]]

    minIdx = Object.keys(@props.data).length - @props.num
    @props.data.forEach ({label, value}, idx) =>
      if idx >= minIdx
        data.labels.push @formatLabel[@props.by]?(label) ? label
        data.series[0].push value

    #data.labels = data.labels[(-1*@props.num)..]
    #data.series[0] = data.series[0][(-1*@props.num)..]

    <div className="svg-container">
      <ChartistGraph className="ct-major-twelfth" type="Bar" data={data} options={@props.options} />
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

  render: ->
    <div className="project-stats-page content-container">
      <div className="project-stats-dashboard">
        <div className="major">
          Classifications: {@props.totalClassifications.toLocaleString()}
        </div>
        <Progress progress={@props.totalClassifications / @props.requiredClassifications} />
        <div>
          Volunteers: {@props.totalVolunteers.toLocaleString()}
        </div>
        <div>
          Online now: {@props.currentVolunteers.toLocaleString()}
        </div>
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
  mixins: [History]

  handleGraphChange: (which, e) ->
    query = qs.parse location.search.slice 1
    query[which] = e.target.value
    {owner, name} = @props.params
    @history.pushState(null, "/projects/#{owner}/#{name}/stats/", query)

  getQuery: (which) ->
    qs.parse(location.search.slice(1))[which]

  render: ->
    queryProps =
      handleGraphChange: @handleGraphChange
      classificationsBy: @getQuery('classifications') ? 'hour'
      volunteersBy: @getQuery('valunteerss') ? 'hour'
      projectId: @props.project.id
      totalClassifications: @props.project.classifications_count
      # there must be a better way to get this number
      requiredClassifications: @props.project.classifications_count / @props.project.completeness
      totalVolunteers: @props.project.classifiers_count
      currentVolunteers: @props.project.activity

    <ProjectStatsPage {...queryProps} />

module.exports = ProjectStatsPageController
