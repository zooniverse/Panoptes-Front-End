React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
Loading = require('../../components/loading-indicator').default

module.exports = createReactClass
  displayName: 'ModerationActions'

  propTypes:
    reports: PropTypes.array.isRequired

  getInitialState: ->
    reports: null

  componentDidMount: ->
    Promise.all(@props.reports.map (report) =>
      apiClient.type('users').get(report.user_id.toString()).then (user) =>
        Object.assign { }, report, {user}
    ).then (reports) =>
      @setState {reports}

  render: ->
    baseLink = "/"
    if @props.project?
      baseLink += "projects/#{@props.project.slug}/"
    <ul>
      {if @state.reports
        for report, i in @state.reports
          <li key={"report-#{i}"}>
            <Link to="#{baseLink}users/#{report.user.login}">{report.user.display_name}</Link>: {report.message}
          </li>
      else
        <Loading />}
    </ul>
