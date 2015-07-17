React = require 'react'
apiClient = require '../api/client'
getPageOfComment = require './lib/get-page-of-comment'
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
      <PromiseRenderer promise={discussion.get('comments', {page_size: 1, sort: '-created_at'}).index(0)}>{(comment) =>
        <div className="talk-discussion-link">
          <PromiseRenderer promise={apiClient.type('users').get(comment.user_id, {})}>{(user) =>
            <Link className="user-profile-link" to="user-profile" params={name: user.login}>
              <Avatar user={user} />{' '}{user.display_name}
            </Link>
          }</PromiseRenderer>{' '}

          {if @props.title
            <span>
              <Link
                to="#{@projectPrefix()}talk-discussion"
                params={merge({}, {board: discussion.board_id, discussion: discussion.id}, @props.params)}
                query={page: getPageOfComment(comment, discussion, PAGE_SIZE), scrollToLastComment: true}>
                {discussion.title}
              </Link>{' '}
            </span>
            }

          <Link
            to="#{@projectPrefix()}talk-discussion"
            params={merge({}, {board: discussion.board_id, discussion: discussion.id}, @props.params)}
            query={page: getPageOfComment(comment, discussion, PAGE_SIZE), scrollToLastComment: true}>
            {timeAgo(comment.updated_at)}
          </Link>
        </div>
      }</PromiseRenderer>
    </div>
