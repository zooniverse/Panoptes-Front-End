React = require 'react'

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
    project.get 'workflows'
      .then (allWorkflows) ->
        allWorkflows.filter (workflow) ->
          workflow.active and not workflow.finished_at?
      .then (activeUnfinishedWorkflows) =>
        activeUnfinishedWorkflows.length is 0

  getResultsPageExistence: (project) ->
    project.get 'pages'
      .then (pages) ->
        pages.filter (page) ->
          page.url_key is 'result'
      .then ([resultsPage]) ->
        resultsPage?

  render: ->
    if @state.projectIsComplete
      <div className="project-finished-banner">
        <p>
          Looks like this project is all finished at the moment!{' '}
          {if @state.hasResultsPage
            <strong>
              <a href="./results">See the results.</a>
            </strong>}
        </p>
      </div>
    else
      null
