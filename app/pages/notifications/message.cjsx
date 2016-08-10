React = require 'react'
{Link} = require 'react-router'
{Markdown} = (require 'markdownz').default
moment = require 'moment'
talkClient = require 'panoptes-client/lib/talk-client'
Loading = require '../../components/loading-indicator'
Avatar = require '../../partials/avatar'

module.exports = React.createClass
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
    baseLink = "/"
    if @props.project?
      baseLink += "projects/#{@props.project.slug}/"
    if @state.message
      <div className="conversation-message talk-module">
        <Link to="/inbox/#{notification.source.conversation_id}" {...@props} className="message-link">
          {notification.message}{' '}
          in {@state.conversation.title}
        </Link>

        <Markdown>{@state.message.body}</Markdown>

        <div className="bottom">
          <Link className="user-profile-link" to="#{baseLink}users/#{@state.messageUser.login}">
            <Avatar user={@state.messageUser} />{' '}{@state.messageUser.display_name}
          </Link>{' '}
          <Link to={"/inbox/#{notification.source.conversation_id}"} {...@props} className="time-ago">
            {moment(@state.message.created_at).fromNow()}
          </Link>
        </div>
      </div>
    else
      <div className="talk-module">
        <Loading />
      </div>
