React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
parseSection = require './lib/parse-section'
talkConfig = require './config'
{Link, Navigation} = require '@edpaget/react-router'

PAGE_SIZE = talkConfig.discussionPageSize

module?.exports = React.createClass
  displayName: 'TalkCommentLink'
  mixins: [Navigation]

  propTypes:
    comment: React.PropTypes.object  # Comment resource
    pageSize: React.PropTypes.number # Optional: pass this in to override default PAGE_SIZE

  getDefaultProps: ->
    pageSize: PAGE_SIZE

  projectComment: ->
    console.log @props.comment.section, 'zooniverse'
    @props.comment.section isnt 'zooniverse'

  pathname: ->
    if process.env.NON_ROOT == 'true' then window.location.pathname else ''

  projectCommentUrl: ->
    {comment} = @props
    [ownerName, projectName] = comment.project_slug.split('/')
    href = @makeHref 'project-talk-discussion',
      {
        board: comment.board_id,
        discussion: comment.discussion_id,
        owner: ownerName,
        name: projectName
      },
      {
        comment: comment.id
      }
    window.location.origin + @pathname() + href

  mainTalkCommentUrl: ->
    {comment} = @props
    window.location.origin + @pathname() +
    @makeHref 'talk-discussion',
      {board: comment.board_id, discussion: comment.discussion_id},
      {comment: comment.id}

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
