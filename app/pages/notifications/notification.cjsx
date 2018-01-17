React = require 'react'
createReactClass = require 'create-react-class'
CommentNotification = require './comment'
DataRequestNotification = require './data-request'
MessageNotification = require './message'
ModerationNotification = require './moderation'
StartedDiscussionNotification = require './started-discussion'

module.exports = createReactClass
  displayName: 'Notification'

  propTypes:
    data: React.PropTypes.object.isRequired
    notification: React.PropTypes.object.isRequired
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired

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
    key = "#{ notification.source_type }-notification-#{ notification.source_id }"
    <div className="notification" key={key}>
      {@renderNotification()}
    </div>
