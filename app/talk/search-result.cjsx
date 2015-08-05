React = require 'react'
DiscussionPreview = require './discussion-preview'
CommentLink = require './comment-link'
CommentPreview = require './comment-preview'
PromiseRenderer = require '../components/promise-renderer'
parseSection = require './lib/parse-section'
apiClient = require '../api/client'

# This isn't very reuseable as it's prop is a comment resource with it's
# linked discussion added on. Probably a better way to approach this.

module.exports = React.createClass
  displayName: "TalkSearchResult"

  discussionFromComment: (comment) ->
    id: comment.discussion_id
    board_id: comment.board_id
    title: comment.discussion_title
    users_count: comment.discussion_users_count
    comments_count: comment.discussion_comments_count
    latest_comment: comment

  render: ->
    comment = @props.data
    discussion = @discussionFromComment comment
    section = parseSection(comment.section)

    <div className="talk-search-result talk-module">
      <CommentLink comment={comment}>{comment.discussion_title}</CommentLink>
      <CommentPreview content={comment.body} header={null} />
      {if section is 'zooniverse'
        <DiscussionPreview {...@props} discussion={discussion} comment={comment} />
      else
        [owner, name] = comment.project_slug.split('/')
        <DiscussionPreview {...@props} discussion={discussion} owner={owner} name={name} comment={comment} />
      }
    </div>
