React = require 'react'
{Link} = require 'react-router'
{timestamp} = require './lib/time'
resourceCount = require './lib/resource-count'
{State} = require 'react-router'
merge = require 'lodash.merge'

module?.exports = React.createClass
  displayName: 'TalkDiscussionPreview'

  propTypes:
    data: React.PropTypes.object

  projectPrefix: ->
    if @props.project then 'project-' else ''

  render: ->
    <div className="talk-discussion-preview">
      <div className="preview-content">
        <h1>
          <Link to="#{@projectPrefix()}talk-discussion" params={merge({}, {board: @props.data.board_id, discussion: @props.data.id}, @props.params)}>
            {@props.data.title}
          </Link>
        </h1>
        <p className="talk-discussion-preview-author">Started by <Link to="user-profile" params={name: @props.data.user_login}>{@props.data.user_display_name}</Link> on {timestamp(@props.data.created_at)}</p>
      </div>
      <div className="preview-stats">
        <p>
          <i className="fa fa-user"></i> {resourceCount(@props.data.users_count, "Users")}
        </p>
        <p>
          <i className="fa fa-comment"></i> {resourceCount(@props.data.comments_count, "Comments")}
        </p>
      </div>
    </div>
