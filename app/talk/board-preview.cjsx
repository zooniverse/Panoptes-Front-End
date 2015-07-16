React = require 'react'
{Link} = require 'react-router'
{timestamp, timeAgo} = require './lib/time'
resourceCount = require './lib/resource-count'
talkClient = require '../api/talk'
PromiseRenderer = require '../components/promise-renderer'
apiClient = require '../api/client'
merge = require 'lodash.merge'
Avatar = require '../partials/avatar'
getPageOfComment = require './lib/get-page-of-comment'
config = require './config'

PAGE_SIZE = config.boardPageSize

module?.exports = React.createClass
  displayName: 'TalkBoardDisplay'

  propTypes:
    data: React.PropTypes.object

  projectPrefix: ->
    if @props.project then 'project-' else ''

  render: ->
    <div className="talk-board-preview">
      <div className="preview-content">
        <h1>
          <Link to="#{@projectPrefix()}talk-board" params={merge({}, {board: @props.data.id}, @props.params)}>
             {@props.data.title}
          </Link>
        </h1>

        <p>{@props.data.description}</p>

        <PromiseRenderer promise={talkClient.type('discussions').get({board_id: @props.data.id}).index(0)}>{(discussion) =>
          if discussion?
            comments = discussion.links.comments
            lastCommentId = comments[comments.length-1]

            <PromiseRenderer promise={talkClient.type('comments').get(lastCommentId)}>{(comment) =>
              <div className="talk-discussion-link">
                <PromiseRenderer promise={apiClient.type('users').get(comment.user_id, {})}>{(user) =>
                  <Link className="user-profile-link" to="user-profile" params={name: user.login}>
                    <Avatar user={user} />{' '}{user.display_name}
                  </Link>
                }</PromiseRenderer>{' '}

                <Link to="#{@projectPrefix()}talk-discussion" params={merge({}, {board: discussion.board_id, discussion: discussion.id}, @props.params)} query={page: getPageOfComment(comment, discussion, PAGE_SIZE), scrollToLastComment: true}>{discussion.title}</Link>{' '}
                <span>{timeAgo(discussion.updated_at)}</span>
              </div>
            }</PromiseRenderer>
        }</PromiseRenderer>
      </div>

      <div className="preview-stats">
        <p><i className="fa fa-user"></i> {resourceCount(@props.data.users_count, "Users")}</p>
        <p><i className="fa fa-newspaper-o"></i> {resourceCount(@props.data.discussions_count, "Discussions") }</p>

        <p><i className="fa fa-comment"></i> {resourceCount(@props.data.comments_count, "Comments")}</p>
      </div>
    </div>
