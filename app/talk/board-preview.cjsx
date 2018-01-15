React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
resourceCount = require './lib/resource-count'
LatestCommentLink = require './latest-comment-link'

module.exports = createReactClass
  displayName: 'TalkBoardDisplay'

  propTypes:
    data: PropTypes.object

  private: ->
    @props.data.permissions.read isnt 'all'

  boardLink: ->
    {owner, name} = @props.params
    boardId = @props.data.id

    if @props.project
      <Link to="/projects/#{owner}/#{name}/talk/#{boardId}">
        {@props.data.title}
      </Link>
    else
      <Link to="/talk/#{boardId}">{@props.data.title}</Link>

  render: ->
    <div className="talk-board-preview #{if @private() then 'private' else 'all'}">
      {if @private()
        <i className="board-locked fa fa-lock" />
        }

      <div className="preview-content">
        <h1>
          {@boardLink()}
        </h1>

        <p>{@props.data.description}</p>

        <LatestCommentLink {...@props}
          title={true}
          project={@props.project}
          discussion={@props.data.latest_discussion}
          comment={@props.comment}
          author={@props.author}
          roles={@props.roles}
        />
      </div>

      <div className="preview-stats">
        <p><i className="fa fa-user"></i> {resourceCount(@props.data.users_count, "Participants")}</p>
        <p><i className="fa fa-newspaper-o"></i> {resourceCount(@props.data.discussions_count, "Discussions") }</p>

        <p><i className="fa fa-comment"></i> {resourceCount(@props.data.comments_count, "Comments")}</p>
      </div>
    </div>
