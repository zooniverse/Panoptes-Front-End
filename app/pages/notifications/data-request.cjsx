React = require 'react'
moment = require 'moment'

module.exports = React.createClass
  displayName: 'DataRequestNotification'

  propTypes:
    data: React.PropTypes.object.isRequired
    notification: React.PropTypes.object.isRequired
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired

  stopPropagation: (e) ->
    e.stopPropagation()

  render: ->
    notification = @props.notification
    <div className="data-request-notification talk-module">
      <p className="title">
        Data export from {@props.data.projectName}
      </p>

      <div className="bottom">
        <a href={notification.url} target="_blank" onClick={@stopPropagation}>{notification.message}</a>
        {' '}
        <a className="time-ago" href={notification.url} target="_blank" onClick={@stopPropagation}>{moment(@props.notification.created_at).fromNow()}</a>
      </div>
    </div>
