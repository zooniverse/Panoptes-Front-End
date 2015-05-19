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
ROLES = require './lib/roles'
merge = require 'lodash.merge'

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

  boardRequest: ->
    id = @props.params.board.toString()
    talkClient.type('boards').get(id)

  setBoard: ->
    @boardRequest()
      .then (board) => @setState {board}

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
            @setState newDiscussionOpen: false
            @setDiscussions()

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
          @transitionTo('talk')

  onPageChange: (page) ->
    @goToPage(page)

  onEditTitle: (e) ->
    e.preventDefault()
    form = React.findDOMNode(@).querySelector('.talk-edit-board-form')

    input = form.querySelector('input')
    title = input.value

    # permissions
    read = form.querySelector(".roles-read input[name='role-read']:checked").value
    write = form.querySelector(".roles-write input[name='role-write']:checked").value
    permissions = {read, write}
    board = {title, permissions}

    @boardRequest().update(board).save()
      .then (board) => @setState {board}

  onClickNewDiscussion: ->
    @setState newDiscussionOpen: !@state.newDiscussionOpen

  roleReadLabel: (data, i) ->
    <label key={i}>
      <input
        type="radio"
        name="role-read"
        onChange={=>
          @setState board: merge {}, @state.board, {permissions: read: data}
        }
        value={data}
        checked={@state.board.permissions.read is data}/>
      {data}
    </label>

  roleWriteLabel: (data, i) ->
    <label key={i}>
      <input
        type="radio"
        name="role-write"
        onChange={=>
          @setState board: merge {}, @state.board, {permissions: write: data}
        }
        checked={@state.board.permissions.write is data}
        value={data}/>
      {data}
    </label>

  render: ->
    <div className="talk-board">
      <h1 className="talk-page-header">{@state.board?.title}</h1>
      <Moderation>
        <div>
          <h2>Moderator Zone:</h2>
          {if @state.board?.title
            <form className="talk-edit-board-form" onSubmit={@onEditTitle}>
              <h3>Edit Title:</h3>
              <input onChange={@onChangeTitle} defaultValue={@state.board?.title}/>

              <h4>Can Read:</h4>
              <div className="roles-read">{ROLES.map(@roleReadLabel)}</div>

              <h4>Can Write:</h4>
              <div className="roles-write">{ROLES.map(@roleWriteLabel)}</div>

              <button type="submit">Update</button>
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
