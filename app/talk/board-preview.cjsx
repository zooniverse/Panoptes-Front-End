React = require 'react'
{Link} = require 'react-router'
{timestamp, timeAgo} = require './lib/time'
resourceCount = require './lib/resource-count'
talkClient = require '../api/talk'
PromiseRenderer = require '../components/promise-renderer'
apiClient = require '../api/client'
LatestCommentLink = require './latest-comment-link'
merge = require 'lodash.merge'

module?.exports = React.createClass
  displayName: 'TalkBoardDisplay'

  propTypes:
    data: React.PropTypes.object

  render: ->
    <div className="talk-board-preview">
      <div className="preview-content">
        <h1>
          <Link to="#{if @props.project then 'project-' else ''}talk-board" params={merge({}, {board: @props.data.id}, @props.params)}>
             {@props.data.title}
          </Link>
        </h1>

        <p>{@props.data.description}</p>

        <PromiseRenderer promise={talkClient.type('discussions').get({board_id: @props.data.id, sort_linked_comments: 'created_at'}).index(0)}>{(discussion) =>
          if discussion?
            <LatestCommentLink {...@props} title={true} project={@props.project} discussion={discussion} />
        }</PromiseRenderer>
      </div>

      <div className="preview-stats">
        <p><i className="fa fa-user"></i> {resourceCount(@props.data.users_count, "Participants")}</p>
        <p><i className="fa fa-newspaper-o"></i> {resourceCount(@props.data.discussions_count, "Discussions") }</p>

        <p><i className="fa fa-comment"></i> {resourceCount(@props.data.comments_count, "Comments")}</p>
      </div>
    </div>
