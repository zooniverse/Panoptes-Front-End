React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
CommentNotification = require './comment'
DataRequestNotification = require './data-request'
MessageNotification = require './message'
ModerationNotification = require './moderation'
StartedDiscussionNotification = require './started-discussion'

module.exports = createReactClass
  displayName: 'Notification'

  propTypes:
    data: PropTypes.object.isRequired
    notification: PropTypes.object.isRequired
    project: PropTypes.object
    user: PropTypes.object.isRequired

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
