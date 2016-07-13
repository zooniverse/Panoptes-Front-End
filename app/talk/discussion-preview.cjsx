React = require 'react'
{Link} = require 'react-router'
resourceCount = require './lib/resource-count'
PromiseRenderer = require '../components/promise-renderer'
LatestCommentLink = require './latest-comment-link'
Thumbnail = require '../components/thumbnail'
apiClient = require 'panoptes-client/lib/api-client'
getSubjectLocation = require '../lib/get-subject-location'

module.exports = React.createClass
  displayName: 'TalkDiscussionPreview'

  propTypes:
    discussion: React.PropTypes.object

  contextTypes:
    geordi: React.PropTypes.object

  logDiscussionClick: ->
    @context.geordi?.logEvent
      type: "view-discussion"

  discussionLink: ->
    {discussion} = @props

    if (@props.params?.owner and @props.params?.name) # get from url if possible
      {owner, name} = @props.params
      projectTalk = "/projects/#{owner}/#{name}/talk/#{discussion.board_id}/#{discussion.id}"
      <Link to={projectTalk} onClick={@logDiscussionClick.bind null, this}>{discussion.title}</Link>

    else if @props.project # otherwise fetch from project
      [owner, name] = @props.project.slug.split('/')
      projectTalk = "/projects/#{owner}/#{name}/talk/#{discussion.board_id}/#{discussion.id}"
      <Link to={projectTalk} onClick={@logDiscussionClick.bind null, this}>{discussion.title}</Link>

    else # link to zooniverse main talk
      <Link to="/talk/#{discussion.board_id}/#{discussion.id}" onClick={@logDiscussionClick.bind null, this}>
        {discussion.title}
      </Link>

  render: ->
    {params, discussion} = @props
    comment = @props.comment or discussion.latest_comment

    <div className="talk-discussion-preview">
      <div className="preview-content">

        {if discussion.focus_id and (discussion.focus_type is 'Subject')
          <div className="subject-preview">
            <PromiseRenderer catch={null} promise={apiClient.type('subjects').get(discussion.focus_id)}>{(subject) =>
              <Thumbnail src={getSubjectLocation(subject).src} width={100} />
            }</PromiseRenderer>
          </div>
          }

        <h1>
          {<i className="fa fa-thumb-tack talk-sticky-pin"></i> if discussion.sticky}
          {@discussionLink()}
        </h1>

        <LatestCommentLink {...@props} project={@props.project} discussion={discussion} comment={@props.comment} preview={true} />

      </div>
      <div className="preview-stats">
        <p>
          <i className="fa fa-user"></i> {resourceCount(discussion.users_count, "Participants")}
        </p>
        <p>
          <i className="fa fa-comment"></i> {resourceCount(discussion.comments_count, "Comments")}
        </p>
      </div>
    </div>
