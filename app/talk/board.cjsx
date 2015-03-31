React = require 'react'
DiscussionPreview = require './discussion-preview'
talkClient = require '../api/talk'
authClient = require '../api/auth'
CommentBox = require './comment-box'
commentValidations = require './lib/comment-validations'
discussionValidations = require './lib/discussion-validations'
{getErrors} = require './lib/validations'
Router = require 'react-router'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
Paginator = require './lib/paginator'
Moderation = require './lib/moderation'

module?.exports = React.createClass
  displayName: 'TalkBoard'
  mixins: [Router.Navigation]

  getInitialState: ->
    discussions: []
    board: {}
    discussionsMeta: {}
    newDiscussionOpen: false
    discussionValidationErrors: []

  componentWillMount: ->
    @setDiscussions()
    @setBoard()

  goToPage: (n) ->
    @transitionTo(@props.pathname, @props.params, {page: n})
    @setDiscussions(n)

  discussionsRequest: (page) ->
    board_id = +@props.params.board
    talkClient.type('discussions').get({board_id, page_size: 5, page})

  setDiscussions: (page = 1) ->
    @discussionsRequest(page)
      .then (discussions) =>
        discussionsMeta = discussions[0]?.getMeta()
        @setState {discussions, discussionsMeta}
      .catch (e) =>
        console.log "failed to get discussion", e

  boardRequest: ->
    id = +@props.params.board
    talkClient.type('boards').get({id})

  setBoard: ->
    @boardRequest()
      .then (board) => @setState {board: board[0]}
      .catch (e) => console.log "failed to get board", e

  onSubmitDiscussion: (e, commentText, focusImage) ->
    titleInput = @getDOMNode().querySelector('.talk-board-new-discussion input')
    title = titleInput.value

    return console.log "failed validation" unless title

    authClient.checkCurrent()
      .then (user) =>
        user_id = user.id
        board_id = +@props.params.board
        body = commentText

        discussion = {title, user_id, board_id, comments: [{user_id, body}]}

        talkClient.type('discussions').create(discussion).save()
          .then (discussion) =>
            console.log "discussion save successful", discussion
            @setState newDiscussionOpen: false
            @setDiscussions()
          .catch (e) =>
            console.log "error saving discussion", e
      .catch (e) => console.log "error checking auth", e

  discussionValidations: (commentBody) ->
    # TODO: return true if any additional validations fail
    discussionTitle = @getDOMNode().querySelector('.new-discussion-title').value
    commentErrors = getErrors(commentBody, commentValidations)
    discussionErrors = getErrors(discussionTitle, discussionValidations)

    discussionValidationErrors = commentErrors.concat(discussionErrors)
    @setState {discussionValidationErrors}
    !!discussionValidationErrors.length

  discussionPreview: (discussion, i) ->
    <DiscussionPreview {...@props} key={i} data={discussion} />

  onClickDeleteBoard: ->
    if window.confirm("Are you sure that you want to delete this board? All of the comments and discussions will be lost forever.")
      @boardRequest().delete()
        .then (deleted) =>
          console.log "deleted", deleted
          @transitionTo('talk')
        .catch (e) -> console.log "error deleting", e

  onPageChange: (page) ->
    @goToPage(page)

  onEditTitle: (e) ->
    input = document.querySelector('.talk-edit-board-title-form input')
    title = input.value

    @boardRequest().update({title}).save()
      .then (board) =>
        @setState {board: board[0]}
      .catch (e) ->
        console.log "error on edit board title", e

  onClickNewDiscussion: ->
    @setState newDiscussionOpen: !@state.newDiscussionOpen

  render: ->
    <div className="talk-board">
      <h1 className="talk-page-header">{@state.board?.title}</h1>
      <Moderation>
        <div>
          <h2>Moderator Zone:</h2>
          {if @state.board?.title
            <form className="talk-edit-board-title-form" onSubmit={@onEditTitle}>
              <h3>Edit Title:</h3>
              <input onChange={@onChangeTitle} defaultValue={@state.board?.title}/>
              <button type="submit">Update Title</button>
            </form>}

          <button onClick={@onClickDeleteBoard}>
            Delete this board <i className="fa fa-close" />
          </button>
        </div>
      </Moderation>

      <ChangeListener target={authClient}>{=>
        <PromiseRenderer promise={authClient.checkCurrent()}>{(user) =>
          if user?
            <section>
              <button onClick={@onClickNewDiscussion}>
                <i className="fa fa-#{if @state.newDiscussionOpen then 'close' else 'plus'}" />&nbsp;
                New Discussion
              </button>

              {if @state.newDiscussionOpen
                <div className="talk-board-new-discussion">
                  <h2>Create a disussion +</h2>
                  <input className="new-discussion-title" type="text" placeholder="Discussion Title"/><br/>
                  <CommentBox
                    header={null}
                    validationCheck={@discussionValidations}
                    validationErrors={@state.discussionValidationErrors}
                    submitFeedback={"Discussion successfully created"}
                    placeholder={"Add a comment here to start the discussion. This comment will appear at the start of the discussion."}
                    onSubmitComment={@onSubmitDiscussion}
                    submit="Create Discussion"/>
                 </div>}
             </section>
           else
             <p>Please sign in to create discussions</p>
        }</PromiseRenderer>
      }</ChangeListener>

      <div className="talk-list-content">
        <section>
          {if @state.discussions.length
            @state.discussions.map(@discussionPreview)
           else
            <p>There are currently no discussions in this board.</p>}
        </section>

        <div className="talk-sidebar">
          <h2>Talk Sidebar</h2>
          <section>
            <h3>Description:</h3>
            <p>{@state.board?.description}</p>
            <h3>Join the Discussion</h3>
            <p>Check out the existing posts or start a new discussion of your own</p>
          </section>
        </div>
      </div>

      <Paginator page={+@state.discussionsMeta?.page} onPageChange={@onPageChange} pageCount={@state.discussionsMeta?.page_count} />

    </div>
