React = require 'react'
{Link} = require 'react-router'
{timestamp, timeAgo} = require './lib/time'
resourceCount = require './lib/resource-count'
{State} = require 'react-router'
merge = require 'lodash.merge'
PromiseRenderer = require '../components/promise-renderer'
apiClient = require '../api/client'
getPageOfComment = require './lib/get-page-of-comment'
Avatar = require '../partials/avatar'

PAGE_SIZE = 10

module?.exports = React.createClass
  displayName: 'TalkDiscussionPreview'

  propTypes:
    discussion: React.PropTypes.object

  projectPrefix: ->
    if @props.project then 'project-' else ''

  render: ->
    {params, discussion} = @props

    <div className="talk-discussion-preview">
      <div className="preview-content">
        <h1>
          {<i className="fa fa-thumb-tack talk-sticky-pin"></i> if discussion.sticky}
          {if params?.owner and params?.name # get from url if possible
            <Link to="project-talk-discussion" params={board: discussion.board_id, discussion: discussion.id, owner: params.owner, name: params.name}>
              {discussion.title}
            </Link>

          else if @props.project # otherwise fetch from project
            <PromiseRenderer promise={@props.project.get('owner')}>{(owner) =>
              <Link to="project-talk-discussion" params={board: discussion.board_id, discussion: discussion.id, owner: owner.login, name: @props.project.slug}>
                {discussion.title}
              </Link>
            }</PromiseRenderer>

          else # link to zooniverse main talk
            <Link to="talk-discussion" params={board: discussion.board_id, discussion: discussion.id}>
              {discussion.title}
            </Link>
            }

        </h1>

        <PromiseRenderer promise={discussion.get('comments', {page_size: 1, sort: '-created_at'}).index(0)}>{(comment) =>
          <div className="talk-discussion-link">
            <PromiseRenderer promise={apiClient.type('users').get(comment.user_id, {})}>{(user) =>
              <Link className="user-profile-link" to="user-profile" params={name: user.login}>
                <Avatar user={user} />{' '}{user.display_name}
              </Link>
            }</PromiseRenderer>{' '}

            <Link
              to="#{if @props.project then 'project-' else ''}talk-discussion"
              params={merge({}, {board: discussion.board_id, discussion: discussion.id}, @props.params)}
              query={page: getPageOfComment(comment, discussion, PAGE_SIZE), scrollToLastComment: true}>
              {timeAgo(comment.updated_at)}
            </Link>
          </div>
        }</PromiseRenderer>

      </div>
      <div className="preview-stats">
        <p>
          <i className="fa fa-user"></i> {resourceCount(discussion.users_count, "Users")}
        </p>
        <p>
          <i className="fa fa-comment"></i> {resourceCount(discussion.comments_count, "Comments")}
        </p>
      </div>
    </div>
