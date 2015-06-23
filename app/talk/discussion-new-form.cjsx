React = require 'react'
CommentBox = require './comment-box'
{getErrors} = require './lib/validations'
commentValidations = require './lib/comment-validations'
discussionValidations = require './lib/discussion-validations'
talkClient = require '../api/talk'
authClient = require '../api/auth'
Loading = require '../components/loading-indicator'
PromiseRenderer = require '../components/promise-renderer'
projectSection = require '../talk/lib/project-section'
merge = require 'lodash.merge'

module?.exports = React.createClass
  displayName: 'DiscussionNewForm'

  propTypes:
    boardId: React.PropTypes.number
    onCreateDiscussion: React.PropTypes.func
    subject: React.PropTypes.object # subject response

  getInitialState: ->
    discussionValidationErrors: []
    loading: false

  discussionValidations: (commentBody) ->
    discussionTitle = @getDOMNode().querySelector('.new-discussion-title').value
    commentErrors = getErrors(commentBody, commentValidations)
    discussionErrors = getErrors(discussionTitle, discussionValidations)

    discussionValidationErrors = commentErrors.concat(discussionErrors)

    @setState {discussionValidationErrors}
    !!discussionValidationErrors.length

  onSubmitDiscussion: (e, commentText, subject) ->
    @setState loading: true
    form = @getDOMNode().querySelector('.talk-board-new-discussion')
    titleInput = form.querySelector('input[type="text"]')
    title = titleInput.value

    authClient.checkCurrent()
      .then (user) =>
        user_id = user.id
        board_id = @props.boardId ? +form.querySelector('label > input[type="radio"]:checked').value
        body = commentText
        focus_id = +@props.subject?.id
        focus_type = 'Subject' if !!focus_id

        comments = [merge({}, {user_id, body}, ({focus_id, focus_type} if !!focus_id))]
        discussion = {title, user_id, board_id, comments}

        talkClient.type('discussions').create(discussion).save()
          .then (discussion) =>
            @setState loading: false
            titleInput.value = ''
            @props.onCreateDiscussion?(discussion)

  boardRadio: (board, i) ->
    <label key={board.id}>
      <input
        type="radio"
        name="board"
        defaultChecked={i is 0} # pre-check the first
        value={board.id} />
      {board.title}
    </label>

  render: ->
    <div className="discussion-new-form">
      <div className="talk-board-new-discussion">
        <h2>Create a discussion +</h2>
        {if not @props.boardId
          <PromiseRenderer promise={@props.subject.get('project')}>{(project) =>
            <PromiseRenderer promise={talkClient.type('boards').get(section: projectSection(project))}>{(boards) =>
              <div>
                <h2>Board</h2>
                {boards.map @boardRadio}
              </div>
            }</PromiseRenderer>
          }</PromiseRenderer>
          }
        <input
          className="new-discussion-title"
          type="text"
          placeholder="Discussion Title"/>
        <CommentBox
          header={null}
          validationCheck={@discussionValidations}
          validationErrors={@state.discussionValidationErrors}
          submitFeedback={"Discussion successfully created"}
          placeholder={"""Add a comment here to start the discussion.
          This comment will appear at the start of the discussion."""}
          onSubmitComment={@onSubmitDiscussion}
          subject={@props.subject}
          submit="Create Discussion"/>
        {if @state.loading then <Loading />}
      </div>
    </div>
