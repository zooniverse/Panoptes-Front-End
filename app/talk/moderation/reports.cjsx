React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
Loading = require '../../components/loading-indicator'
ContextualLinks = require '../../lib/contextual-links'

module?.exports = React.createClass
  displayName: 'ModerationActions'

  propTypes:
    reports: React.PropTypes.array.isRequired

  getInitialState: ->
    reports: null

  componentDidMount: ->
    Promise.all(@props.reports.map (report) =>
      apiClient.type('users').get(report.user_id.toString()).then (user) =>
        Object.assign { }, report, {user}
    ).then (reports) =>
      @setState {reports}

  render: ->
    <ul>
      {if @state.reports
        for report, i in @state.reports
          link = ContextualLinks.prefixLinkIfNeeded @props, "/users/#{report.user.login}"
          <li key={"report-#{i}"}>
            <Link to="#{link}">{report.user.display_name}</Link>: {report.message}
          </li>
      else
        <Loading />}
    </ul>
