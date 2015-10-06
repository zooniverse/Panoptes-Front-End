React = require 'react'
{Link} = require '@edpaget/react-router'
{Markdown} = require 'markdownz'
moment = require 'moment'
talkClient = require '../../api/talk'
Loading = require '../../components/loading-indicator'
Avatar = require '../../partials/avatar'

module?.exports = React.createClass
  displayName: 'MessageNotification'

  propTypes:
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired
    notification: React.PropTypes.object.isRequired

  getInitialState: ->
    message: null
    messageUser: null
    conversation: null

  componentWillMount: ->
    talkClient.type('messages').get(@props.notification.source_id, include: 'conversation,user').then (message) =>
      message.get('user').then (messageUser) =>
        message.get('conversation').then (conversation) =>
          @setState {message, conversation, messageUser}

  render: ->
    notification = @props.notification
    if @state.message
      <div className="conversation-message talk-module" key={"message-#{ @state.message.id }"}>
        <Link to="inbox-conversation" {...@props} params={conversation: notification.source.conversation_id} className="message-link">
          {notification.message}{' '}
          in {@state.conversation.title}
        </Link>

        <Markdown>{@state.message.body}</Markdown>

        <div className="bottom">
          <Link className="user-profile-link" to="user-profile" params={name: @state.messageUser.login}>
            <Avatar user={@state.messageUser} />{' '}{@state.messageUser.display_name}
          </Link>{' '}
          <Link to="inbox-conversation" {...@props} params={conversation: notification.source.conversation_id} className="time-ago">
            {moment(@state.message.created_at).fromNow()}
          </Link>
        </div>
      </div>
    else
      <div className="talk-module">
        <Loading />
      </div>
