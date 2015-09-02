React = require 'react'
{Link} = require 'react-router'
DiscussionPreview = require './discussion-preview'
talkClient = require '../api/talk'
CommentBox = require './comment-box'
commentValidations = require './lib/comment-validations'
discussionValidations = require './lib/discussion-validations'
{getErrors} = require './lib/validations'
Router = require 'react-router'
NewDiscussionForm = require './discussion-new-form'
Paginator = require './lib/paginator'
Moderation = require './lib/moderation'
StickyDiscussionList = require './sticky-discussion-list'
ROLES = require './lib/roles'
Loading = require '../components/loading-indicator'
merge = require 'lodash.merge'
talkConfig = require './config'
SignInPrompt = require '../partials/sign-in-prompt'
alert = require '../lib/alert'

promptToSignIn = -> alert (resolve) -> <SignInPrompt onChoose={resolve} />

PAGE_SIZE = talkConfig.boardPageSize

module?.exports = React.createClass
  displayName: 'TalkBoard'
  mixins: [Router.Navigation]

  getInitialState: ->
    discussions: []
    board: {}
    discussionsMeta: {}
    newDiscussionOpen: false
    loading: true

  getDefaultProps: ->
    query: page: 1

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.query.page is @props.query.page
      @setDiscussions(nextProps.query.page ? 1)

  componentWillMount: ->
    @setDiscussions(@props.query.page ? 1)
    @setBoard()

  discussionsRequest: (page) ->
    @setState loading: true
    board_id = +@props.params.board
    talkClient.type('discussions').get({board_id, page_size: PAGE_SIZE, page})

  setDiscussions: (page = @props.query.page) ->
    @discussionsRequest(page)
      .then (discussions) =>
        discussionsMeta = discussions[0]?.getMeta()
        @setState {discussions, discussionsMeta, loading: false}

  boardRequest: ->
    id = @props.params.board.toString()
    talkClient.type('boards').get(id)

  setBoard: ->
    @boardRequest()
      .then (board) => @setState {board}

  onCreateDiscussion: ->
    @setState newDiscussionOpen: false
    @setDiscussions()

  discussionPreview: (discussion, i) ->
    <DiscussionPreview {...@props} key={i} discussion={discussion} />

  onClickDeleteBoard: ->
    if window.confirm("Are you sure that you want to delete this board? All of the comments and discussions will be lost forever.")
      {owner, name} = @props.params
      if @state.board.section is 'zooniverse'
        @boardRequest().delete()
          .then =>
            @transitionTo('talk')
      else
        @boardRequest().delete()
          .then =>
            @transitionTo('project-talk', {owner: owner, name: name})

  onEditBoard: (e) ->
    e.preventDefault()
    form = React.findDOMNode(@).querySelector('.talk-edit-board-form')

    input = form.querySelector('input')
    title = input.value

    description = form.querySelector('textarea').value

    # permissions
    read = form.querySelector(".roles-read input[name='role-read']:checked").value
    write = form.querySelector(".roles-write input[name='role-write']:checked").value
    permissions = {read, write}
    board = {title, permissions, description}

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
    {board} = @state

    <div className="talk-board">
      <h1 className="talk-page-header">{board?.title}</h1>
      {if board && @props.user?
        <Moderation section={board.section} user={@props.user}>
          <div>
            <h2>Moderator Zone:</h2>

            <Link
              to="#{if @props.section isnt 'zooniverse' then 'project-' else ''}talk-moderations"
              params={
                if (@props.params?.owner and @props.params?.name)
                  {owner: @props.params.owner, name: @props.params.name}
                else
                  {}
              }>
              View Reported Comments
            </Link>

            {if board?.title
              <form className="talk-edit-board-form" onSubmit={@onEditBoard}>
                <h3>Edit Title:</h3>
                <input defaultValue={board?.title}/>

                <h3>Edit Description</h3>
                <textarea defaultValue={board?.description}></textarea>

                <h4>Can Read:</h4>
                <div className="roles-read">{ROLES.map(@roleReadLabel)}</div>

                <h4>Can Write:</h4>
                <div className="roles-write">{ROLES.map(@roleWriteLabel)}</div>

                <button type="submit">Update</button>
              </form>}

            <button onClick={@onClickDeleteBoard}>
              Delete this board <i className="fa fa-close" />
            </button>

            <StickyDiscussionList board={board} />
          </div>
        </Moderation>}

      {if @props.user?
        <section>
          <button onClick={@onClickNewDiscussion}>
            <i className="fa fa-#{if @state.newDiscussionOpen then 'close' else 'plus'}" />&nbsp;
            New Discussion
          </button>

          {if @state.newDiscussionOpen
            <NewDiscussionForm
              boardId={+@props.params.board}
              onCreateDiscussion={@onCreateDiscussion}
              user={@props.user} />}
         </section>
       else
         <p>Please <span className="link-style" onClick={promptToSignIn}>sign in</span> to create discussions</p>}

      <div className="talk-list-content">
        <section>
          {if @state.loading
            <Loading />
           else if @state.discussions?.length
            @state.discussions.map(@discussionPreview)
           else
            <p>There are currently no discussions in this board.</p>}
        </section>

        <div className="talk-sidebar">
          <h2>Talk Sidebar</h2>
          <section>
            <h3>Description:</h3>
            <p>{board?.description}</p>
            <h3>Join the Discussion</h3>
            <p>Check out the existing posts or start a new discussion of your own</p>
          </section>

          <section>
            <h3>
              {if @props.section is 'zooniverse'
                <Link className="sidebar-link" to="talk-board-recents" {...@props}>Recent Comments</Link>
              else
                <Link className="sidebar-link" to="project-talk-board-recents" {...@props}>Recent Comments</Link>
              }
            </h3>
          </section>
        </div>
      </div>

      <Paginator page={+@state.discussionsMeta?.page} pageCount={@state.discussionsMeta?.page_count} />
    </div>
