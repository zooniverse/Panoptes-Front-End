React = require 'react'
{Markdown} = require 'markdownz'
apiClient = require 'panoptes-client/lib/api-client'
DiscussionPreview = require './discussion-preview'
CommentLink = require './comment-link'
parseSection = require './lib/parse-section'
CommentContextIcon = require './lib/comment-context-icon'
getSubjectLocation = require '../lib/get-subject-location'
`import Thumbnail from '../components/thumbnail';`

# This isn't very reuseable as it's prop is a comment resource with it's
# linked discussion added on. Probably a better way to approach this.

module.exports = React.createClass
  displayName: "TalkSearchResult"

  getInitialState: ->
    subject: null

  componentDidMount: ->
    @getSubject @props.data

  discussionFromComment: (comment) ->
    id: comment.discussion_id
    board_id: comment.board_id
    title: comment.discussion_title
    users_count: comment.discussion_users_count
    comments_count: comment.discussion_comments_count
    latest_comment: comment

  getSubject: (comment)->
    if comment.focus_id and comment.focus_type is 'Subject'
      apiClient.type 'subjects'
        .get comment.focus_id
        .then (media) =>
          subject = getSubjectLocation media
          @setState { subject }

  render: ->
    comment = @props.data
    discussion = @discussionFromComment comment
    section = parseSection(comment.section)
    [owner, name] = comment.project_slug?.split('/') or []

    <div className="talk-search-result talk-module">
      {if @state.subject?
        <Thumbnail src={@state.subject.src} format={@state.subject.format} width={100} height={150} controls={false} />
      }
      <CommentContextIcon comment={comment}></CommentContextIcon>
      <CommentLink comment={comment} project={@props.project}>{comment.discussion_title}</CommentLink>
      <Markdown content={comment.body} project={@props.project} />
      <DiscussionPreview {...@props} discussion={discussion} owner={owner} name={name} comment={comment} />
    </div>
