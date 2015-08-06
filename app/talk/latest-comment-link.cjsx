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

  lastPage: ->
    Math.ceil @props.discussion.comments_count / PAGE_SIZE

  render: ->
    {discussion} = @props
    return <div /> unless discussion
    comment = @props.comment or discussion.latest_comment
    linkQuery = if @props.comment
      comment: comment.id
    else
      scrollToLastComment: true, page: @lastPage()

    <div className="talk-latest-comment-link">
      <div className="talk-discussion-link">
        <PromiseRenderer promise={apiClient.type('users').get(comment.user_id, {})}>{(user) =>
          <Link className="user-profile-link" to="user-profile" params={name: user.login}>
            <Avatar user={user} />{' '}{user.display_name}
          </Link>
        }</PromiseRenderer>{' '}

        {if discussion.title
          <span>
            <Link
              to="#{@projectPrefix()}talk-discussion"
              params={merge({}, {board: discussion.board_id, discussion: discussion.id}, @props.params)}
              query={linkQuery}>
              {discussion.title}
            </Link>{' '}
          </span>
          }

        <Link
          to="#{@projectPrefix()}talk-discussion"
          params={merge({}, {board: discussion.board_id, discussion: discussion.id}, @props.params)}
          query={linkQuery}>
          {timeAgo(comment.created_at)}
        </Link>
      </div>
    </div>
