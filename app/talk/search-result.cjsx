React = require 'react'
DiscussionPreview = require './discussion-preview'
CommentLink = require './comment-link'
CommentPreview = require './comment-preview'

# This isn't very reuseable as it's prop is a comment resource with it's
# linked discussion added on. Probably a better way to approach this.

module.exports = React.createClass
  displayName: "TalkSearchResult"

  render: ->
    discussion = @props.data.discussion

    <div className="talk-search-result">
      <CommentLink comment={@props.data}>Comment #{discussion.links.comments.indexOf(@props.data.id) + 1} in {discussion.title}</CommentLink>
      <CommentPreview content={@props.data.body} header={null} />
      <DiscussionPreview data={discussion} />
    </div>
