React = require 'react'
{History} = require 'react-router'
PromiseToSetState = require '../../../lib/promise-to-set-state'
qs = require 'qs'
ProjectStatsPage = require './stats'

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
    query["#{which}Range"] = undefined
    {owner, name} = @props.params
    @history.replaceState(null, "/projects/#{owner}/#{name}/stats/", query)
    
  handleWorkflowChange: (which, e) ->
    query = qs.parse location.search.slice 1
    [name, value] = e.target.value.split('=')
    if name is 'workflow_id'
      query[name] = value
    else
      query['workflow_id'] = undefined
    query["#{which}Range"] = undefined
    {owner, name} = @props.params
    @history.replaceState(null, "/projects/#{owner}/#{name}/stats/", query)

  handleRangeChange: (which, range) ->
    query = qs.parse location.search.slice 1
    query["#{which}Range"] = range
    {owner, name} = @props.params
    @history.replaceState(null, "/projects/#{owner}/#{name}/stats/", query)

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
      handleRangeChange: @handleRangeChange
      handleWorkflowChange: @handleWorkflowChange
      classificationsBy: @getQuery('classification') ? 'day'
      classificationRange: @getQuery('classificationRange')
      commentsBy: @getQuery('comment') ? 'day'
      commentRange: @getQuery('commentRange')
      projectId: @props.project.id
      workflowId: @getQuery('workflow_id')
      totalVolunteers: @props.project.classifiers_count
      currentClassifications: @props.project.activity
      workflows: @state.workflowList
      startDate: @props.project.launch_date

    <ProjectStatsPage {...queryProps} />

StatsHoldingPage = React.createClass
  render: ->
    <div className="project-text-content content-container">
      <div className="project-stats-dashboard">
        Project statistics are currently unavailable and we are working to fix the issue.
      </div>
    </div>

#module.exports = ProjectStatsPageController
module.exports = StatsHoldingPage
