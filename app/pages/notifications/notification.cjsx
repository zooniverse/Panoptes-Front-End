React = require 'react'
talkClient = require '../../api/talk'
CommentNotification = require './comment'
DataRequestNotification = require './data-request'
MessageNotification = require './message'
ModerationNotification = require './moderation'

module?.exports = React.createClass
  displayName: 'Notification'

  propTypes:
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired
    notification: React.PropTypes.object.isRequired

  renderNotification: ->
    switch @props.notification.source_type
      when 'Comment'
        <CommentNotification {...@props} />
      when 'DataRequest'
        <DataRequestNotification {...@props} />
      when 'Message'
        <MessageNotification {...@props} />
      when 'Moderation'
        <ModerationNotification {...@props} />

  render: ->
    notification = @props.notification
    delivered = if notification.delivered then '' else 'unread'

    <div className={"#{ delivered } notification"}>
      {@renderNotification()}
    </div>
