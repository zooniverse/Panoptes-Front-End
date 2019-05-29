React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
ReactDOM = require 'react-dom'
CommentBox = require './comment-box'
{getErrors} = require './lib/validations'
commentValidations = require './lib/comment-validations'
discussionValidations = require './lib/discussion-validations'
talkClient = require 'panoptes-client/lib/talk-client'
Loading = require('../components/loading-indicator').default
projectSection = require '../talk/lib/project-section'

module.exports = createReactClass
  displayName: 'DiscussionNewForm'

  contextTypes:
    geordi: PropTypes.object

  propTypes:
    boardId: PropTypes.number
    onCreateDiscussion: PropTypes.func
    project: PropTypes.object
    subject: PropTypes.object # subject response

  getInitialState: ->
    discussionValidationErrors: []
    loading: false
    boards: []

  componentDidMount: ->
    @updateBoards @props.subject

  componentWillReceiveProps: (newProps) ->
    @updateBoards newProps.subject if newProps.subject isnt @props.subject

  updateBoards: (subject) ->
    if @props.project?.id
      @getProjectBoards(@props.project)
    else
      subject?.get 'project'
        .then (project) =>
          @getProjectBoards(project)
    
  getProjectBoards: (project) ->
    talkClient.type 'boards'
      .get
        section: projectSection(project)
        subject_default: false
        page_size: 50
      .then (boards) =>
        @setState {boards}

  discussionValidations: (commentBody) ->
    discussionTitle = ReactDOM.findDOMNode(@).querySelector('.new-discussion-title').value
    commentErrors = getErrors(commentBody, commentValidations)
    discussionErrors = getErrors(discussionTitle, discussionValidations)

    discussionValidationErrors = commentErrors.concat(discussionErrors)

    @setState {discussionValidationErrors}
    !!discussionValidationErrors.length

  onSubmitDiscussion: (e, commentText, subject) ->
    @setState loading: true
    form = ReactDOM.findDOMNode(@).querySelector('.talk-board-new-discussion')
    titleInput = form.querySelector('input[type="text"]')
    title = titleInput.value

    user_id = @props.user.id
    board_id = @props.boardId ? +form.querySelector('label > input[type="radio"]:checked').value
    body = commentText
    focus_id = subject?.id
    focus_type = 'Subject' if !!focus_id

    comment = if !!focus_id
      {user_id, body, focus_id, focus_type}
    else
      {user_id, body}

    comments = [comment]
    discussion = {title, user_id, board_id, comments}

    talkClient.type('discussions').create(discussion).save()
      .then (discussion) =>
        @setState loading: false
        titleInput.value = ''
        @context?.geordi?.logEvent
          type: 'add-discussion'
          data: discussion.title
        @props.onCreateDiscussion?(discussion)

  boardRadio: (board, i) ->
    <label key={board.id}>
      <input
        type="radio"
        name="board"
        defaultChecked={i is 0}
        value={board.id} />
      {board.title}
    </label>

  render: ->
    <div className="discussion-new-form">
      <div className="talk-board-new-discussion">
        <h2>Create a discussion +</h2>
        {if not @props.boardId
          <div>
            <h2>Board</h2>
            {@state.boards.map @boardRadio}
          </div>
          }
        <input
          className="new-discussion-title"
          type="text"
          placeholder="Discussion Title"/>
        <CommentBox
          user={@props.user}
          project={@props.project}
          header={null}
          validationCheck={@discussionValidations}
          validationErrors={@state.discussionValidationErrors}
          submitFeedback={"Discussion successfully created"}
          placeholder={"""Add a comment here to start the discussion.
          This comment will appear at the start of the discussion."""}
          onSubmitComment={@onSubmitDiscussion}
          logSubmit={true}
          subject={@props.subject}
          submit="Create Discussion"/>
        {if @state.loading then <Loading />}
      </div>
    </div>
