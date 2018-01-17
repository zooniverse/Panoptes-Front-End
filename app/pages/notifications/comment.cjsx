React = require 'react'
createReactClass = require 'create-react-class'
{Markdown} = require 'markdownz'
{Link} = require 'react-router'
moment = require 'moment'
Loading = require '../../components/loading-indicator'
Avatar = require '../../partials/avatar'

module.exports = createReactClass
  displayName: 'CommentNotification'

  propTypes:
    data: React.PropTypes.object.isRequired
    notification: React.PropTypes.object
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired

  getDefaultProps: ->
    startedDiscussion: false

  getInitialState: ->
    comment: null

  render: ->
    notification = @props.notification
    comment = @props.data.comment
    commentUser = @props.data.commentUser

    if @props.data.comment
      <div className="conversation-message talk-module">
        {if notification.delivered is false and !@props.startedDiscussion
          <i title="Unread" className="fa fa-star fa-lg" />}

        <Link to={notification.url} className="message-link">
          {comment.discussion_title}
        </Link>

        <Markdown>{comment.body}</Markdown>

        <div className="bottom">
          <Link className="user-profile-link" to="/users/#{commentUser.login}">
            <Avatar user={commentUser} />{' '}{commentUser.display_name}
          </Link>{' '}
          <Link to={notification.url} className="time-ago">
            {moment(comment.created_at).fromNow()}
          </Link>
        </div>
      </div>
    else
      <div className="talk-module">
        <Loading />
      </div>
