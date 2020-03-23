React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
resourceCount = require './lib/resource-count'
LatestCommentLink = require './latest-comment-link'
baseURL = require('./lib/base-url').default
getSubjectLocation = require '../lib/get-subject-location'

# `import Thumbnail from '../components/thumbnail';`
Thumbnail = require('../components/thumbnail').default

module.exports = createReactClass
  displayName: 'TalkDiscussionPreview'

  propTypes:
    discussion: PropTypes.object

  getDefaultProps: ->
    project: {}

  discussionLink: ->
    {discussion, project} = @props

    if (project && @props.params?.owner and @props.params?.name) # get from url if possible
      {owner, name} = @props.params
      "/#{baseURL(project)}/#{owner}/#{name}/talk/#{discussion.board_id}/#{discussion.id}"

    else if (project && project.slug) # otherwise fetch from project
      "/#{baseURL(project)}/#{project.slug}/talk/#{discussion.board_id}/#{discussion.id}"

    else # link to zooniverse main talk
      "/talk/#{discussion.board_id}/#{discussion.id}"

  render: ->
    {params, discussion} = @props
    comment = @props.comment or discussion.latest_comment

    <div className="talk-discussion-preview">
      <div className="preview-content">

        {if @props.subject?
          subject = getSubjectLocation(@props.subject)
          <div className="subject-preview">
            <Link to={@discussionLink()}>
              <Thumbnail
                src={subject.src}
                type={subject.type}
                format={subject.format}
                width={100}
                height={150}
                controls={false}
              />
            </Link>
          </div>
        }

        <h1>
          {<i className="fa fa-thumb-tack talk-sticky-pin"></i> if discussion.sticky}
          <Link to={@discussionLink()}>
            {discussion.title}
          </Link>
        </h1>

        <LatestCommentLink
          {...@props}
          project={@props.project}
          discussion={discussion}
          comment={@props.comment}
          author={@props.author}
          roles={@props.roles}
          preview={true}
        />

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
