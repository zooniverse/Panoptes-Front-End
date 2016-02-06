React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
parseSection = require './lib/parse-section'
talkConfig = require './config'

PAGE_SIZE = talkConfig.discussionPageSize

module?.exports = React.createClass
  displayName: 'TalkCommentLink'

  propTypes:
    comment: React.PropTypes.object  # Comment resource
    pageSize: React.PropTypes.number # Optional: pass this in to override default PAGE_SIZE

  getDefaultProps: ->
    pageSize: PAGE_SIZE

  projectComment: ->
    @props.comment.section isnt 'zooniverse'

  projectCommentUrl: ->
    {comment} = @props
    [ownerName, projectName] = comment.project_slug.split('/')
    document.baseURI.slice(0, -1) + "/projects/#{ownerName}/#{projectName}/talk/#{comment.board_id}/#{comment.discussion_id}?comment=#{comment.id}"

  mainTalkCommentUrl: ->
    {comment} = @props
    document.baseURI.slice(0, -1) + "/talk/#{comment.board_id}/#{comment.discussion_id}?comment=#{comment.id}"

  render: ->
    <div className="talk-comment-link">
      {if @projectComment()
        <a href={@projectCommentUrl()}>
          {@props.children ? @projectCommentUrl()}
        </a>

      else
        <a href={@mainTalkCommentUrl()}>
          {@props.children ? @mainTalkCommentUrl()}
        </a>}
    </div>
