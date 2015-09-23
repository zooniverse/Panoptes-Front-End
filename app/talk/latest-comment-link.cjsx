React = require 'react'
apiClient = require '../api/client'
{timeAgo} = require './lib/time'
Avatar = require '../partials/avatar'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'
merge = require 'lodash.merge'
{Markdown} = require 'markdownz'

PAGE_SIZE = require('./config').discussionPageSize

truncate = (string, ending = '', length = 80) ->
  return string if string.trim().length <= length
  string.trim().slice(0, (length - ending.length)) + ending

latestCommentText = (discussion) ->
  container = document.createElement('span')
  React.render(<Markdown content={discussion.latest_comment?.body} />, container)
  container.textContent

module?.exports = React.createClass
  displayName: 'TalkLatestCommentComment'

  propTypes:
    project: React.PropTypes.object
    discussion: React.PropTypes.object
    title: React.PropTypes.bool
    preview: React.PropTypes.bool

  getDefaultProps: ->
    title: false
    preview: false

  projectPrefix: ->
    if @props.project then 'project-' else ''

  lastPage: ->
    Math.ceil @props.discussion.comments_count / PAGE_SIZE

  render: ->
    {discussion} = @props
    comment = @props.comment ? discussion?.latest_comment
    return <div /> unless (discussion and comment)

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

        {if discussion.title and @props.title
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
          className="latest-comment-time"
          params={merge({}, {board: discussion.board_id, discussion: discussion.id}, @props.params)}
          query={linkQuery}>
          {timeAgo(comment.created_at)}
        </Link>

        {if @props.preview
          <Link
            className="latest-comment-preview-link"
            to="#{@projectPrefix()}talk-discussion"
            params={merge({}, {board: discussion.board_id, discussion: discussion.id}, @props.params)}
            query={linkQuery}>

            {' '}{truncate(latestCommentText(discussion), '...')}
          </Link>
          }
      </div>
    </div>
