React = require 'react'
{Link} = require 'react-router'

THREE_DAYS = 3 * 24 * 60 * 60 * 1000

module.exports = React.createClass
  getDefaultProps: ->
    project: null
    dismissFor: THREE_DAYS

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

  hide: ->
    dismissals = JSON.parse(localStorage.getItem 'finished-project-dismissals') ? {}
    dismissals[@props.project.id] = Date.now()
    localStorage.setItem 'finished-project-dismissals', JSON.stringify dismissals
    @forceUpdate()

  render: ->
    dismissals = JSON.parse(localStorage.getItem 'finished-project-dismissals') ? {}
    recentlyDismissed = Date.now() - dismissals[@props.project.id] < @props.dismissFor

    if recentlyDismissed or not @state.projectIsComplete
      null
    else
      <div className="successful project-announcement-banner">
        <p>
          <strong>Great work!</strong>{' '}
          Looks like this project is out of data at the moment!<br />
          {if @state.hasResultsPage
            [owner, name] = @props.project.slug.split '/'
            <strong>
              <Link to="/projects/#{owner}/#{name}/results">See the results</Link>
            </strong>}{' '}
            <small>
              or{' '}
              <button type="button" className="secret-button" onClick={@hide}><u>dismiss this message</u></button>
            </small>
        </p>
      </div>
