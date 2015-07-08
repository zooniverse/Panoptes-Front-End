React = require 'react'
CommentBox = require './comment-box'
talkClient = require '../api/talk'
apiClient = require '../api/client'
parseSection = require './lib/parse-section'
projectSection = require './lib/project-section'
{State, Navigation} = require 'react-router'
merge = require 'lodash.merge'
getPageOfComment = require './lib/get-page-of-comment'
{getErrors} = require './lib/validations'
commentValidations = require './lib/comment-validations'

BOARD_TITLE = 'Notes'            # Name of board to put subject comments
BOARD_DESCRIPTION = 'General comment threads about individual subjects'

defaultDiscussionTitle = (subject) ->
  "Subject #{subject.id}"

PAGE_SIZE = 10

module?.exports = React.createClass
  displayName: 'TalkQuickSubjectCommentForm'
  mixins: [State, Navigation]

  propTypes:
    subject: React.PropTypes.object
    user: React.PropTypes.object

  getInitialState: ->
    commentValidationErrors: []

  commentValidations: (commentBody) ->
    commentErrors = getErrors(commentBody, commentValidations)
    @setState {commentValidationErrors}
    !!commentErrors.length

  onSubmitComment: (e, commentText, subject) ->
    e.preventDefault()
    {name, owner} = @getParams() # of project, maybe better to pass in as prop later

    # get project
    apiClient.type('projects').get({slug: name})
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
                        pageOfComment = getPageOfComment(comment, discussion, PAGE_SIZE)
                        @transitionTo('project-talk-discussion', {owner: owner, name: project.slug, board: discussion.board_id, discussion: discussion.id}, {page: pageOfComment, comment: comment.id})

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
                        @transitionTo('project-talk-discussion', {owner: owner, name: project.slug, board: discussion.board_id, discussion: discussion.id})

            else
              throw new Error("A board for subject comments has not been setup for this project yet.")


  render: ->
    <div className="quick-subject-comment-form talk-module">
      <h1>Leave a note about this subject</h1>
      <CommentBox
        header={null}
        validationCheck={@commentErrors}
        validationErrors={@state.commentValidationErrors}
        submitFeedback={"Comment successfully added"}
        placeholder={"Add a note about this subject."}
        onSubmitComment={@onSubmitComment}
        subject={@props.subject}
        submit="Add Your comment"/>
    </div>
