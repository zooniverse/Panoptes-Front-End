React = require 'react'
{Link} = require 'react-router'
{timestamp} = require './lib/time'
resourceCount = require './lib/resource-count'
{State} = require 'react-router'
merge = require 'lodash.merge'
PromiseRenderer = require '../components/promise-renderer'

module?.exports = React.createClass
  displayName: 'TalkDiscussionPreview'

  propTypes:
    data: React.PropTypes.object

  render: ->
    params = @props.params

    <div className="talk-discussion-preview">
      <div className="preview-content">
        <h1>
          {<i className="fa fa-thumb-tack talk-sticky-pin"></i> if @props.data.sticky}
          {if params?.owner and params?.name # get from url if possible
            <Link to="project-talk-discussion" params={board: @props.data.board_id, discussion: @props.data.id, owner: params.owner, name: params.name}>
              {@props.data.title}
            </Link>
          else if @props.project # otherwise fetch from project
            <PromiseRenderer promise={@props.project.get('owner')}>{(owner) =>
              <Link to="project-talk-discussion" params={board: @props.data.board_id, discussion: @props.data.id, owner: owner.login, name: @props.project.slug}>
                {@props.data.title}
              </Link>
            }</PromiseRenderer>

          else # link to zooniverse main talk
            <Link to="talk-discussion" params={board: @props.data.board_id, discussion: @props.data.id}>
              {@props.data.title}
            </Link>
            }

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
