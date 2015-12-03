React = require 'react'
{Link} = require '@edpaget/react-router'

module.exports = React.createClass
  getDefaultProps: ->
    project: null

  getInitialState: ->
    projectIsComplete: false
    hasResultsPage: false

  componentDidMount: ->
    @refresh @props.project

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @refresh nextProps.project

  refresh: (project) ->
    @setState
      projectIsComplete: false
      hasResultsPage: false
    Promise.all([
      @getCompleteness project
      @getResultsPageExistence project
    ]).then ([projectIsComplete, hasResultsPage]) =>
      @setState {projectIsComplete, hasResultsPage}

  getCompleteness: (project) ->
    if project.redirect
      Promise.resolve false
    else
      project.get('workflows').then (allWorkflows) ->
        activeWorkflows = allWorkflows.filter (workflow) ->
          workflow.active
        if activeWorkflows.length is 0
          # No active workflows? This is probably a custom project.
          false
        else
          activeUnfinishedWorkflows = activeWorkflows.filter (workflow) ->
            not workflow.finished_at?
          activeUnfinishedWorkflows.length is 0

  getResultsPageExistence: (project) ->
    project.get('pages').then (pages) ->
      resultsPages = pages.filter (page) ->
        page.url_key is 'result'
      resultsPages[0]?

  render: ->
    if @state.projectIsComplete
      <div className="project-finished-banner">
        <strong>Great work!</strong>{' '}
        Looks like this project is out of data at the moment!{' '}
        {if @state.hasResultsPage
          [owner, name] = @props.project.slug.split '/'
          <strong>
            <Link to="project-results" params={{owner, name}}>See the results.</Link>
          </strong>}
      </div>
    else
      null
