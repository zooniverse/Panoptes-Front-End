React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkConfig = require './config'
{Link} = require 'react-router'

PAGE_SIZE = talkConfig.discussionPageSize

module.exports = createReactClass
  displayName: 'TalkCommentLink'

  propTypes:
    comment: PropTypes.object  # Comment resource
    pageSize: PropTypes.number # Optional: pass this in to override default PAGE_SIZE

  getDefaultProps: ->
    pageSize: PAGE_SIZE

  projectComment: ->
    @props.comment.section isnt 'zooniverse'

  projectCommentUrl: ->
    {comment} = @props
    "/projects/#{comment.project_slug}/talk/#{comment.board_id}/#{comment.discussion_id}?comment=#{comment.id}"

  mainTalkCommentUrl: ->
    {comment} = @props
    "/talk/#{comment.board_id}/#{comment.discussion_id}?comment=#{comment.id}"

  render: ->
    href = if @projectComment() then @projectCommentUrl() else @mainTalkCommentUrl()

    <div className="talk-comment-link">
      <Link to={href}>
        {@props.children ? window.location.origin + href}
      </Link>
    </div>
