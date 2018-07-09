React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
CommentBox = require './comment-box'
talkClient = require 'panoptes-client/lib/talk-client'
apiClient = require 'panoptes-client/lib/api-client'
projectSection = require './lib/project-section'
merge = require 'lodash/merge'
{getErrors} = require './lib/validations'
commentValidations = require './lib/comment-validations'
talkConfig = require './config'

BOARD_TITLE = 'Notes'            # Name of board to put subject comments
BOARD_DESCRIPTION = 'General comment threads about individual subjects'

defaultDiscussionTitle = (subject) ->
  "Subject #{subject.id}"

PAGE_SIZE = talkConfig.discussionPageSize

module.exports = createReactClass
  displayName: 'TalkQuickSubjectCommentForm'

  propTypes:
    params: PropTypes.shape({
      name: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired
    }).isRequired
    subject: PropTypes.object
    user: PropTypes.object

  contextTypes:
    router: PropTypes.object.isRequired

  getInitialState: ->
    commentValidationErrors: []

  getDefaultProps: ->
    params: {
      name: ''
      owner: ''
    }

  commentValidations: (commentBody) ->
    commentErrors = getErrors(commentBody, commentValidations)
    @setState {commentValidationErrors}
    !!commentErrors.length

  onSubmitComment: (e, commentText, subject) ->
    e.preventDefault()
    {name, owner} = @props.params

    # get project
    apiClient.type('projects').get({slug: owner + '/' + name})
      .then ([project]) =>
        section = projectSection(project)

        # check for a default board
        talkClient.type('boards').get({section, subject_default: true}).index(0)
          .then (board) =>
            if board?
              discussionTitle = defaultDiscussionTitle(@props.subject)

              talkClient.type('discussions').get(board_id: board.id, title: discussionTitle, subject_default: true).index(0)
                .then (discussion) =>
                  if discussion?
                    user_id = @props.user?.id
                    body = commentText
                    discussion_id = +discussion.id

                    comment = merge {}, {user_id, discussion_id, body}

                    talkClient.type('comments').create(comment).save()
                      .then (comment) =>
                        @context.router.push "/projects/#{owner}/#{name}/talk/#{discussion.board_id}/#{discussion.id}?comment=#{comment.id}"
                  else
                    focus_id = +@props.subject?.id
                    focus_type = 'Subject' if !!focus_id
                    user_id = @props.user?.id
                    body = commentText

                    comments = [merge({}, {user_id, body}, ({focus_id, focus_type} if !!focus_id))]

                    discussion = {
                      title: "Subject #{@props.subject.id}"
                      user_id: @props.user?.id
                      subject_default: true,
                      board_id: board.id
                      comments: comments
                      }
                    talkClient.type('discussions').create(discussion).save()
                      .then (discussion) =>
                        @context.router.push "/projects/#{owner}/#{name}/talk/#{discussion.board_id}/#{discussion.id}"

            else
              throw new Error("A board for subject comments has not been setup for this project yet.")


  render: ->
    <div className="quick-subject-comment-form talk-module">
      <h1>Leave a note about this subject</h1>
      <CommentBox
        project={@props.project}
        user={@props.user}
        header={null}
        validationCheck={@commentErrors}
        validationErrors={@state.commentValidationErrors}
        submitFeedback={"Comment successfully added"}
        placeholder={"Add a note about this subject, or mark with a #hashtag"}
        onSubmitComment={@onSubmitComment}
        subject={@props.subject}
        submit="Add Your comment"
        logSubmit={true}/>
    </div>
