React = require 'react'
{Link} = require 'react-router'
{Markdown} = require 'markdownz'
moment = require 'moment'
Loading = require '../../components/loading-indicator'
Avatar = require '../../partials/avatar'

module.exports = React.createClass
  displayName: 'MessageNotification'

  propTypes:
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired
    notification: React.PropTypes.object.isRequired

  render: ->
    notification = @props.notification
    baseLink = "/"
    if @props.project?
      baseLink += "projects/#{@props.project.slug}/"
    if @props.data.message
      <div className="conversation-message talk-module">
        {if notification.delivered is false
          <i title="Unread" className="fa fa-star fa-lg" />}
        <Link to="/inbox/#{notification.source.conversation_id}" {...@props} className="message-link">
          {notification.message}{' '}
          in {@props.data.conversation.title}
        </Link>

        <Markdown>{@props.data.message.body}</Markdown>

        <div className="bottom">
          <Link className="user-profile-link" to="#{baseLink}users/#{@props.data.messageUser.login}">
            <Avatar user={@props.data.messageUser} />{' '}{@props.data.messageUser.display_name}
          </Link>{' '}
          <Link to={"/inbox/#{notification.source.conversation_id}"} {...@props} className="time-ago">
            {moment(@props.data.message.created_at).fromNow()}
          </Link>
        </div>
      </div>
    else
      <div className="talk-module">
        <Loading />
      </div>
