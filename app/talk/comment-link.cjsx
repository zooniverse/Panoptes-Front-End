React = require 'react'
talkClient = require '../api/talk'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
parseSection = require './lib/parse-section'
talkConfig = require './config'
{Link, Navigation} = require 'react-router'

PAGE_SIZE = talkConfig.discussionPageSize

getPageOfComment = require './lib/get-page-of-comment'

module?.exports = React.createClass
  displayName: 'TalkCommentLink'
  mixins: [Navigation]

  propTypes:
    comment: React.PropTypes.object  # Comment resource
    pageSize: React.PropTypes.number # Optional: pass this in to override default PAGE_SIZE

  getDefaultProps: ->
    pageSize: PAGE_SIZE

  getInitialState: ->
    discussion: {}

  componentWillMount: ->
    @setDiscussion()

  setDiscussion: ->
    {comment} = @props
    talkClient.type('discussions').get(comment.discussion_id, {sort_linked_comments: true})
      .then (discussion) => @setState {discussion}

  projectComment: ->
    @props.comment.section isnt 'zooniverse'

  render: ->
    {discussion} = @state
    {comment} = @props

    <div className="talk-comment-link">
      {if discussion?.id        # Wait for discussion to be set
        pageOfComment = getPageOfComment(comment, discussion, PAGE_SIZE)

        if @projectComment()
          projectId = parseSection(discussion.section)
          project = apiClient.type('projects').get(projectId)

          owner = project.then (project) => project.get('owner')

          <PromiseRenderer promise={Promise.all [project, owner]}>{([project, owner]) =>
            projectCommentUrl =
              window.location.origin + window.location.pathname +
              @makeHref 'project-talk-discussion',
                {
                  board: discussion.board_id,
                  discussion: discussion.id,
                  owner: owner.login,
                  name: project.slug
                }
                {
                  page: pageOfComment,
                  comment: comment.id
                }
            <a href={projectCommentUrl}>
              {@props.children ? projectCommentUrl}
            </a>
          }</PromiseRenderer>

        else
          mainTalkCommentUrl =
            window.location.origin + window.location.pathname +
            @makeHref 'talk-discussion',
              {board: discussion.board_id, discussion: discussion.id},
              {page: pageOfComment, comment: comment.id}
          <a href={mainTalkCommentUrl}>
            {@props.children ? mainTalkCommentUrl}
          </a>
          }
    </div>
