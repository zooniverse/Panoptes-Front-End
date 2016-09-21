React = require 'react'
PromiseToSetState = require '../../../lib/promise-to-set-state'
qs = require 'qs'
ProjectStatsPage = require './stats'
getWorkflowsInOrder = require '../../../lib/get-workflows-in-order'

ProjectStatsPageController = React.createClass
  mixins: [PromiseToSetState]

  contextTypes:
    router: React.PropTypes.object.isRequired

  getInitialState: ->
    workflowList: []

  componentDidMount: ->
    getWorkflowsInOrder @props.project, active: true, fields: 'classifications_count,completeness,display_name,retired_set_member_subjects_count,retirement,subjects_count'
      .then (workflows) =>
        @setState workflowList: workflows

  handleGraphChange: (which, e) ->
    query = qs.parse location.search.slice 1
    query[which] = e.target.value
    query["#{which}Range"] = undefined
    {owner, name} = @props.params
    @context.router.replace
      pathname: "/projects/#{owner}/#{name}/stats/"
      query: query

  handleWorkflowChange: (which, e) ->
    query = qs.parse location.search.slice 1
    [name, value] = e.target.value.split('=')
    if name is 'workflow_id'
      query[name] = value
    else
      query['workflow_id'] = undefined
    query["#{which}Range"] = undefined
    {owner, name} = @props.params
    @context.router.replace
      pathname: "/projects/#{owner}/#{name}/stats/"
      query: query

  handleRangeChange: (which, range) ->
    query = qs.parse location.search.slice 1
    query["#{which}Range"] = range
    {owner, name} = @props.params
    @context.router.replace
      pathname: "/projects/#{owner}/#{name}/stats/"
      query: query

  getQuery: (which) ->
    qs.parse(location.search.slice(1))[which]

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

module.exports = ProjectStatsPageController
