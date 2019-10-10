React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Markdown} = require 'markdownz'
{Link} = require 'react-router'
moment = require 'moment'
Loading = require('../../components/loading-indicator').default
Avatar = require '../../partials/avatar'

module.exports = createReactClass
  displayName: 'CommentNotification'

  propTypes:
    data: PropTypes.object.isRequired
    notification: PropTypes.object
    project: PropTypes.object
    user: PropTypes.object.isRequired

  getDefaultProps: ->
    startedDiscussion: false

  getInitialState: ->
    comment: null

  render: ->
    notification = @props.notification
    comment = @props.data.comment
    commentUser = @props.data.commentUser
    project = @props.project

    if @props.data.comment
      <div className="conversation-message talk-module">
        {if notification.delivered is false and !@props.startedDiscussion
          <i title="Unread" className="fa fa-star fa-lg" />}

        <Link
          className="message-link"
          onClick={() => @props.markAsRead(notification)}
          to={notification.url}
        >
          {comment.discussion_title}
        </Link>

        <Markdown project={project}>{comment.body}</Markdown>

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
