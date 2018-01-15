React = require 'react'
createReactClass = require 'create-react-class'
moment = require 'moment'

module.exports = createReactClass
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
      {if notification.delivered is false
        <i title="Unread" className="fa fa-star fa-lg" />}
      <p className="title">
        Data export from {@props.data.projectName}
      </p>

      <div className="bottom">
        <a href={notification.url} target="_blank" onClick={@stopPropagation}>{notification.message}</a>
        {' '}
        <a className="time-ago" href={notification.url} target="_blank" onClick={@stopPropagation}>{moment(@props.notification.created_at).fromNow()}</a>
      </div>
    </div>
