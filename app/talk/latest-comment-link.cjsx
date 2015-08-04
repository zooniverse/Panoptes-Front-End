React = require 'react'
apiClient = require '../api/client'
{timeAgo} = require './lib/time'
Avatar = require '../partials/avatar'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'
merge = require 'lodash.merge'

PAGE_SIZE = require('./config.coffee').discussionPageSize

module?.exports = React.createClass
  displayName: 'TalkLatestCommentComment'

  propTypes:
    project: React.PropTypes.object
    discussion: React.PropTypes.object
    title: React.PropTypes.bool

  getDefaultProps: ->
    title: false

  projectPrefix: ->
    if @props.project then 'project-' else ''

  render: ->
    {discussion} = @props

    <div className="talk-latest-comment-link">
      <div className="talk-discussion-link">
        <PromiseRenderer promise={apiClient.type('users').get(discussion.latest_comment.user_id, {})}>{(user) =>
          <Link className="user-profile-link" to="user-profile" params={name: user.login}>
            <Avatar user={user} />{' '}{user.display_name}
          </Link>
        }</PromiseRenderer>{' '}

        {if discussion.title
          <span>
            <Link
              to="#{@projectPrefix()}talk-discussion"
              params={merge({}, {board: discussion.board_id, discussion: discussion.id}, @props.params)}
              query={comment: discussion.latest_comment.id}>
              {discussion.title}
            </Link>{' '}
          </span>
          }

        <Link
          to="#{@projectPrefix()}talk-discussion"
          params={merge({}, {board: discussion.board_id, discussion: discussion.id}, @props.params)}
          query={comment: discussion.latest_comment.id}>
          {timeAgo(discussion.latest_comment.updated_at)}
        </Link>
      </div>
    </div>
