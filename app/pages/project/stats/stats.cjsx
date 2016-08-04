React = require 'react'
statsClient = require 'panoptes-client/lib/stats-client'
moment = require 'moment'
{Progress, Graph} = require './charts'

GraphSelect = React.createClass
  getInitialState: ->
    statData: null

  getDefaultProps: ->
    by: 'hour'

  componentDidMount: ->
    @getStats(@props.workflowId, @props.by)

  getStats: (workflowId, binBy) ->
    statsClient
      .query
        projectID: @props.projectId
        workflowID: workflowId
        period: binBy
        type: @props.type
      .then (data) ->
        data.map (stat_object) ->
          label: stat_object.key_as_string
          value: stat_object.doc_count
      .then (statData) =>
        @setState {statData}
      .catch (e) ->
        console?.log 'Failed to fetch stats'

  componentWillReceiveProps: (nextProps) ->
    #update the stats when dropdown options change
    if (@props.workflowId isnt nextProps.workflowId) or (@props.by isnt nextProps.by)
      @getStats(nextProps.workflowId, nextProps.by)

  shouldComponentUpdate: (nextProps, nextState) ->
    return (@props.by isnt nextProps.by) or (@props.workflowId isnt nextProps.workflowId) or (@props.workflows isnt nextProps.workflows) or (@state isnt nextState)

  workflowSelect: ->
    if @props.workflows?
      options = [<option value={"project_id=#{@props.projectId}"} key={"workflowSelectAll"}>All</option>]
      for workflow, key in @props.workflows
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

  getRange: ->
    if @props.range?
      range = []
      for r in @props.range.split(',')
        if r
          range.push(parseInt(r, 10))
        else
          range.push(undefined)
    else
      range = [undefined, undefined]
    range

  render: ->
    if @state.statData?
      range = @getRange()
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
        {<Graph data={@state.statData} by={@props.by} range={range} num={24} handleRangeChange={@handleRangeChange} />}
      </div>
    else
      <div>
        There is no stats data available at this time.
      </div>

  handleGraphChange: (which, e) ->
    @props.handleGraphChange(which, e)

  handleRangeChange: (range) ->
    @props.handleRangeChange(@props.type, range)

ETA = React.createClass
  render: ->
    if @props.data.length > 15
      # don't count the last bin since the current day is not over yet
      value = @props.data.slice(@props.data.length - 15, @props.data.length - 1)
      days = 14
    else
      value = @props.data.slice(0, @props.data.length - 1)
      days = @props.data.length - 1
    rate = value.reduce (a,b) -> a + b
    eta = Math.max(0, Math.ceil(days * (@props.totalCount - @props.currentCount) / rate))
    <div>
      <span className="progress-stats-label">ETC*</span> {"#{eta} days"}
    </div>

WorkflowProgress = React.createClass

  getInitialState: ->
    statData: null

  componentDidMount: ->
    statsClient
      .query
        workflowID: @props.workflow?.id
        period: 'day'
        type: 'classification'
      .then (data) ->
        data.map (stat_object) ->
          stat_object.doc_count
      .then (statData) =>
        @setState {statData}
      .catch (e) ->
        console?.log 'Failed to fetch stats'

  render: ->
    if @props.workflow.retirement.criteria == 'classification_count'
      retirement = <div><span className="progress-stats-label">Retirement limit:</span> {@props.workflow.retirement.options.count.toLocaleString()}</div>
    <div className="progress-element">
      <div className="flex-wrapper">
        <h3>{@props.workflow.display_name}</h3>
        <div>
          {retirement}
        </div>
        <div>
          <span className="progress-stats-label">Images retired:</span> {@props.workflow.retired_set_member_subjects_count.toLocaleString()} / {@props.workflow.subjects_count.toLocaleString()}
        </div>
        <div>
          <span className="progress-stats-label">Classifications:</span> {@props.workflow.classifications_count.toLocaleString()} / {(@props.workflow.subjects_count * @props.workflow.retirement.options.count).toLocaleString()}
        </div>
        {<ETA data={@state.statData} currentCount={@props.workflow.classifications_count} totalCount={@props.workflow.subjects_count * @props.workflow.retirement.options.count} /> if @state.statData?}
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
      progress.push(<WorkflowProgress key={key} workflow={workflow} />)
    progress

  render: ->
    progress = @workflowInfo()
    #Dates for gap in classification stats
    classificationGap = ['2015-06-30T00:00:00.000Z', '2016-06-09T00:00:00.000Z']
    #Dates for gap in talk stats
    talkGap = ['2015-06-30T00:00:00.000Z', '2016-06-09T00:00:00.000Z']
    if @props.startDate
      start =
        <div className="project-metadata-stat">
          <div>{moment(@props.startDate).format 'MMM-DD-YYYY'}</div>
          <div>Launch Date</div>
        </div>
      if moment(@props.startDate) <= moment(classificationGap[1])
        classificationFootnoteMarker = <span><sup>&#8224;</sup></span>
        classificationFootnote =
          <span className="project-stats-footer">
           {classificationFootnoteMarker}
            Due to an issue with our stats server all data before {moment(classificationGap[1]).format 'MMM-DD-YYYY'} is currently unavailable.  We are currently working to resolve this issue.  <b>No</b> classifications were lost in this time.
          </span>
      if moment(@props.startDate) <= moment(talkGap[1])
        talkFootnoteMarker = <span><sup>&#8225;</sup></span>
        talkFootnote =
          <span className="project-stats-footer">
            {talkFootnoteMarker}
            Due to an issue with our stats server all data before {moment(talkGap[1]).format 'MMM-DD-YYYY'} is currently unavailable.  We are currently working to resolve this issue.  <b>No</b> talk comments were lost in this time.
          </span>
    <div className="stats-text-content content-container">
      <div className="project-stats-dashboard">
        <div className="project-metadata-stats">
          {start}
          <div className="project-metadata-stat">
            <div>{@props.totalVolunteers.toLocaleString()}</div>
            <div>Registered Volunteers</div>
          </div>
          <div className="project-metadata-stat">
            <div>{@props.currentClassifications.toLocaleString()}</div>
            <div>Recent Classifications</div>
          </div>
        </div>
        <hr />
        <div className="project-stats-progress">
          <span className="project-stats-heading">Live Workflows</span>
          {progress}
          <span className="project-stats-footer">*Estimated time to completion is based on the classification rate for the past 14 days and may be incorrect due to the way we currently report the data.</span>
        </div>
        <hr />
      </div>
      <span className="project-stats-heading">Classification Stats{classificationFootnoteMarker}</span>
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
      {classificationFootnote}
      <hr />
      <span className="project-stats-heading">Talk Stats{talkFootnoteMarker}</span>
      <div>
        <GraphSelect
        handleGraphChange={@props.handleGraphChange}
        handleRangeChange={@props.handleRangeChange}
        type="comment"
        projectId={@props.projectId}
        by={@props.commentsBy}
        range={@props.commentRange} />
      </div>
      {talkFootnote}

    </div>

module.exports = ProjectStatsPage
