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

  render: ->
    {discussion} = @props.data
    section = parseSection(discussion.section)

    <div className="talk-search-result talk-module">
      <CommentLink comment={@props.data}>Comment #{discussion.links.comments.indexOf(@props.data.id) + 1} in {discussion.title}</CommentLink>
      <CommentPreview content={@props.data.body} header={null} />
      {if section is 'zooniverse'
        <DiscussionPreview discussion={discussion} />
      else
        <PromiseRenderer promise={apiClient.type('projects').get(section)}>{(project) =>
          <DiscussionPreview discussion={discussion} project={project} />
        }</PromiseRenderer>
        }
    </div>
