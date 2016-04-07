React = require 'react'
PromiseRenderer = require '../../../components/promise-renderer'
config = require 'panoptes-client/lib/config'
moment = require 'moment'
{Model, makeHTTPRequest} = require 'json-api-client'
{Progress, Graph} = require './charts'

GraphSelect = React.createClass
  getInitialState: ->
    workflowsLoaded: false

  getDefaultProps: ->
    by: 'hour'
    
  componentWillReceiveProps: (nextProps) ->
    # beacause I can't think of a cleaner way to check for this
    # placing (@props.workflows isnt nextProps.workflows) in shouldComponentUpdate does not work
    # and the workflow dropdown list is never made
    # there might be a nice way to use PromiseRenderer for this
    if (not @state.workflowsLoaded) and (nextProps.workflows?)
      areNulls = false
      for w in nextProps.workflows
        if w is null
          areNulls = true
      if not areNulls
        @setState({workflowsLoaded: true})

  shouldComponentUpdate: (nextProps, nextState) ->
    return (@props.by isnt nextProps.by) or (@props.workflowId isnt nextProps.workflowId) or (@state isnt nextState)

  statCount: (period, type) ->
    query = if @props.workflowId then "workflow_id=#{@props.workflowId}" else "project_id=#{@props.projectId}"
    stats_url = "#{config.statHost}/counts/#{type}/#{period}?#{query}"
    makeHTTPRequest 'GET', stats_url
      .then (response) =>
        results = JSON.parse response.text
        bucket_data = results["events_over_time"]["buckets"]
        data = bucket_data.map (stat_object) =>
          label: stat_object.key_as_string
          value: stat_object.doc_count
      .catch (response) ->
        console?.error 'Failed to get the stats'

  workflowSelect: ->
    if @props.workflows?
      options = [<option value={"project_id=#{@props.projectId}"} key={"workflowSelectAll"}>All</option>]
      for workflow, key in @props.workflows
        if workflow?.active
          options.push(<option value={"workflow_id=#{workflow.id}"} key={"workflowSelect#{key}"}>{workflow.display_name}</option>)
      if options.length > 1
        value = if @props.workflowId then "workflow_id=#{@props.workflowId}" else "project_id=#{@props.projectId}"
        <span>
          {' '}for{' '}
          <select onChange={@handleWorkflowSelect} value={value}>
            {options}
          </select>
        </span>
      
  handleWorkflowSelect: (event) ->
    @props.handleWorkflowChange(@props.type, event)
    
  render: ->
    if @props.range?
      range = []
      for r in @props.range.split(',')
        if r
          range.push(parseInt(r, 10))
        else
          range.push(undefined)
    else
      range = [undefined, undefined]
    workflowSelect = @workflowSelect()
    <div>
      {@props.type[0].toUpperCase() + @props.type.substring(1)}s per{' '}
      <select value={@props.by} onChange={@handleGraphChange.bind this, @props.type}>
        <option value="hour">hour</option>
        <option value="day">day</option>
        <option value="week">week</option>
        <option value="month">month</option>
      </select>
      {workflowSelect}
      <br />
      <PromiseRenderer promise={@statCount(@props.by, @props.type)}>{(statData) =>
        <Graph data={statData} by={@props.by} range={range} num={24} handleRangeChange={@handleRangeChange} />
      }</PromiseRenderer>
    </div>

  handleGraphChange: (which, e) ->
    @props.handleGraphChange(which, e)
    
  handleRangeChange: (range) ->
    @props.handleRangeChange(@props.type, range)

WorkflowProgress = React.createClass
  render: ->
    if @props.workflow.retirement.criteria == 'classification_count'
      retirement = <div><span className="progress-stat-label">Retirement limit:</span> {@props.workflow.retirement.options.count.toLocaleString()}</div>
    <div className="progress-element">
      <div className="flex-wrapper">
        <h3>{@props.workflow.display_name}</h3>
        <div>
          {retirement}
        </div>
        <div>
          <span className="progress-stat-label">Images retired:</span> {@props.workflow.retired_set_member_subjects_count.toLocaleString()} / {@props.workflow.subjects_count.toLocaleString()}
        </div>
        <div>
          <span className="progress-stat-label">Classifications:</span> {@props.workflow.classifications_count.toLocaleString()} / {(@props.workflow.subjects_count * @props.workflow.retirement.options.count).toLocaleString()}
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
      start =
        <div className="project-metadata-stat">
          <div>{moment(@props.startDate).format 'MMM-DD-YYYY'}</div>
          <div>Launch Date</div>
        </div>
    <div className="project-stats-page content-container">
      <div className="project-stats-dashboard">
        <div className="project-metadata-stats">
          {start}
          <div className="project-metadata-stat">
            <div>{@props.totalVolunteers.toLocaleString()}</div>
            <div>Volunteers</div>
          </div>
          <div className="project-metadata-stat">
            <div>{@props.currentVolunteers.toLocaleString()}</div>
            <div>Online now</div>
          </div>
        </div>
        <hr />
        <div className="project-stats-progress">
          <span className="project-stats-heading">Live Workflows</span>
          {progress}
        </div>
        <hr />
      </div>
      <span className="project-stats-heading">Classification Stats</span>
      <div>
        <GraphSelect
          handleGraphChange={@props.handleGraphChange}
          handleRangeChange={@props.handleRangeChange}
          handleWorkflowChange={@props.handleWorkflowChange}
          workflows={@props.workflows}
          workflowId={@props.workflowId}
          type="classification"
          projectId={@props.projectId}
          by={@props.classificationsBy} 
          range={@props.classificationRange} />
      </div>
      <hr />
      <span className="project-stats-heading">Talk Stats</span>
      <div>
        <GraphSelect
        handleGraphChange={@props.handleGraphChange}
        handleRangeChange={@props.handleRangeChange}
        type="comment"
        projectId={@props.projectId}
        by={@props.commentsBy} 
        range={@props.commentRange} />
      </div>

    </div>

module.exports = ProjectStatsPage
