React = require 'react'
apiClient =  require 'panoptes-client/lib/api-client'
moment = require 'moment'

module?.exports = React.createClass
  displayName: 'DataRequestNotification'

  propTypes:
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired
    notification: React.PropTypes.object.isRequired

  getInitialState: ->
    projectName: null

  componentWillMount: ->
    apiClient.type('projects').get(@props.notification.project_id).then (project) =>
      @setState projectName: project.display_name

  stopPropagation: (e) ->
    e.stopPropagation()

  render: ->
    notification = @props.notification
    <div className="data-request-notification talk-module">
      <p className="title">
        Data export from {@state.projectName}
      </p>

      <div className="bottom">
        <a href={notification.url} target="_blank" onClick={@stopPropagation}>{notification.message}</a>
        {' '}
        <a className="time-ago" href={notification.url} target="_blank" onClick={@stopPropagation}>{moment(@props.notification.created_at).fromNow()}</a>
      </div>
    </div>
