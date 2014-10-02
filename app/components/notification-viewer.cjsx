React = require 'react'

Notification = React.createClass
  displayName: 'Notification'

  getDefaultProps: ->
    icon: null
    message: ''


  render: ->
    <div className={"notification #{@props.type}"}>
      {if @props.icon
        <div className="notification-icon-container">
          <i className={"fa fa-#{@props.icon}"}></i>
        </div>}

      <div className="notification-content">
        {@props.children}
      </div>

      <div className="notification-dismissal">
        <button onClick={@props.onClickRemove}>&times;</button>
      </div>
    </div>

module.exports = React.createClass
  displayName: 'NotificationViewer'

  getInitialState: ->
    notifications: [].concat []...,
      # {timestamp: new Date, message: 'This is a notification.'}
      # {timestamp: new Date, icon: 'thumbs-o-up', message: 'This is a notification with an icon.'}
      # {timestamp: new Date, type: 'log', message: 'This is a log.'}
      # {timestamp: new Date, type: 'warning', icon: 'exclamation-circle', message: 'This is a warning!'}
      # {timestamp: new Date, type: 'error', message: 'This is an error!'}

  # componentDidMount: ->
  #   addEventListener 'log', @handleNewLogNotification

  # componentWillUnmount: ->
  #   removeEventListener 'log', @handleNewLogNotification

  handleNewLogNotification: (e) ->

  render: ->
    notifications = for {timestamp, type, icon, message} in @state.notifications
      key = timestamp + type + message + icon
      <Notification key={key} timestamp={timestamp} type={type} icon={icon}>{message}</Notification>

    <div className="notification-viewer">
      {notifications}
    </div>
