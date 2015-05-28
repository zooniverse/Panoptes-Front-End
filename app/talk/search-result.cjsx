React = require 'react'
DiscussionPreview = require './discussion-preview'
CommentLink = require './comment-link'
CommentPreview = require './comment-preview'

# This isn't very reuseable as it's prop is a comment resource with it's
# linked discussion added on. Probably a better way to approach this.

module.exports = React.createClass
  displayName: "TalkSearchResult"

  render: ->
    <div className="talk-search-result">
      <CommentLink {...@props.data} />
      <CommentPreview content={@props.data.body} header={null} />
      <DiscussionPreview data={@props.data.discussion} />
    </div>
