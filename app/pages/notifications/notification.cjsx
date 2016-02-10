React = require 'react'
CommentNotification = require './comment'
DataRequestNotification = require './data-request'
MessageNotification = require './message'
ModerationNotification = require './moderation'
StartedDiscussionNotification = require './started-discussion'

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
      when 'Discussion'
        <StartedDiscussionNotification {...@props} />

  render: ->
    {notification} = @props
    delivered = if notification.delivered then '' else 'unread'
    key = "#{ notification.source_type }-notification-#{ notification.source_id }"
    <div className={"#{ delivered } notification"} key={key}>
      {@renderNotification()}
    </div>
