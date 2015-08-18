React = {findDOMNode} = require 'react'
Comment = require './comment'
CommentBox = require './comment-box'
commentValidations = require './lib/comment-validations'
{getErrors} = require './lib/validations'
Router = require 'react-router'
talkClient = require '../api/talk'
Paginator = require './lib/paginator'
PromiseRenderer = require '../components/promise-renderer'
upvotedByCurrentUser = require './lib/upvoted-by-current-user'
Moderation = require './lib/moderation'
{timestamp} = require './lib/time'
{Link} = require 'react-router'
merge = require 'lodash.merge'
Avatar = require '../partials/avatar'
DisplayRoles = require './lib/display-roles'
talkConfig = require './config'
SignInPrompt = require '../partials/sign-in-prompt'
alert = require '../lib/alert'
merge = require 'lodash.merge'

PAGE_SIZE = talkConfig.discussionPageSize

module?.exports = React.createClass
  displayName: 'TalkDiscussion'
  mixins: [Router.Navigation, Router.State]

  getInitialState: ->
    comments: []
    discussion: {}
    commentsMeta: {}
    commentValidationErrors: []
    editingTitle: false

  getDefaultProps: ->
    query: page: 1

  promptToSignIn: ->
    alert (resolve) -> <SignInPrompt onChoose={resolve} />

  componentWillReceiveProps: (nextProps) ->
    if @props.params.discussion isnt nextProps.params.discussion
      @setDiscussion(nextProps.params.discussion)
        .then => @setComments(nextProps.query.page ? 1)
    else if nextProps.query.page isnt @props.query.page
      @setComments(nextProps.query.page)

  componentDidMount: ->
    @shouldScrollToBottom = true if @props.query?.scrollToLastComment

  componentWillMount: ->
    @setDiscussion().then =>
      if @props.query?.comment
        commentId = @props.query?.comment
        comments = @state.discussion.links.comments
        commentNumber = comments.indexOf(commentId) + 1
        page = Math.ceil commentNumber / PAGE_SIZE

        if page isnt @props.query.page
          @props.query.page = page
          @transitionTo @getPath(), @props.params, @props.query

      @setComments(@props.query.page ? 1)

  commentsRequest: (page) ->
    {board, discussion} = @props.params
    talkClient.type('comments').get({discussion_id: discussion, page_size: PAGE_SIZE, page})

  setComments: (page = @props.query?.page) ->
    @commentsRequest(page)
      .then (comments) =>
        commentsMeta = comments[0]?.getMeta()
        @setState {comments, commentsMeta}, =>
          if @shouldScrollToBottom and comments.length
            @scrollToBottomOfDiscussion()
            @shouldScrollToBottom = false

  setCommentsMeta: (page = @props.query?.page) ->
    @commentsRequest(page).then (comments) =>
      commentsMeta = comments[0]?.getMeta()
      @setState {commentsMeta}

  scrollToBottomOfDiscussion: ->
    React.findDOMNode(@)?.scrollIntoView(false)

  discussionsRequest: (discussion = @props.params.discussion) ->
    talkClient.type('discussions').get({id: discussion, sort_linked_comments: 'created_at'})

  setDiscussion: (discussion = @props.params.discussion) ->
    @discussionsRequest(discussion)
      .then (discussion) =>
        @setState {discussion: discussion[0]}

  onUpdateComment: (textContent, subject, commentId) ->
    {discussion} = @props.params
    commentToUpdate = talkClient.type('comments').get(id: commentId)

    discussion_id = +discussion
    body = textContent
    focus_id = +subject?.id ? null
    focus_type = 'Subject' if !!focus_id
    comment = merge {}, {discussion_id, body}, ({focus_id, focus_type} if !!focus_id)

    commentToUpdate.update(comment).save()
      .then (comment) =>
        @setComments(@props.query.page)

  onDeleteComment: (commentId) ->
    {board, discussion} = @props.params
    if window.confirm("Are you sure that you want to delete this comment?")
      talkClient.type('comments').get(id: commentId).delete()
        .then (deleted) => @setComments(@props.query.page)

  onSubmitComment: (e, textContent, subject) ->
    {discussion} = @props.params
    user_id = @props.user.id
    discussion_id = +discussion
    body = textContent
    focus_id = +subject?.id ? null
    focus_type = 'Subject' if !!focus_id
    comment = merge {}, {user_id, discussion_id, body}, ({focus_id, focus_type} if !!focus_id)

    talkClient.type('comments').create(comment).save()
      .then (comment) =>
        @setCommentsMeta().then =>
          @setComments(@state.commentsMeta?.page_count)

  onLikeComment: (commentId) ->
    talkClient.type('comments').get(commentId)
      .then (comment) =>
        return alert("Hey you can't upvote your own comment!") if +@props.user?.id is +comment.user_id

        voteUrl = (comment.href + if upvotedByCurrentUser(@props.user, comment) then '/remove_upvote' else '/upvote')
        talkClient.request('put', voteUrl, null, {})
          .then (voted) =>
            @setComments(@props.query.page)

  onClickReply: (user, comment) ->
    # TODO: provide link to user / comment
    if (not @props.user)
      @promptToSignIn()
    else
      quotedComment = comment.body.split("\n")
        .map (line) -> "> #{line}"
        .join("\n")

      reply = "> In reply to #{user.display_name}'s comment: \n#{quotedComment}\n\n"
      @setState {reply}

    findDOMNode(@).scrollIntoView(false)

  comment: (data, i) ->
    <Comment
      {...@props}
      key={data.id}
      data={data}
      active={+data.id is +@props.query?.comment}
      user={@props.user}
      onClickReply={@onClickReply}
      onLikeComment={@onLikeComment}
      onUpdateComment={@onUpdateComment}
      onDeleteComment={@onDeleteComment}/>

  onClickDeleteDiscussion: ->
    if window.confirm("Are you sure that you want to delete this discussions? All of the comments and discussions will be lost forever.")
      @discussionsRequest().delete()
        .then (deleted) =>
          @setComments(@props.query.page)
          {owner, name} = @props.params
          if (owner and name) then @transitionTo('project-talk', {owner, name}) else @transitionTo('talk')

  commentValidations: (commentBody) ->
    # TODO: return true if any additional validations fail
    commentValidationErrors = getErrors(commentBody, commentValidations)
    @setState {commentValidationErrors}
    !!commentValidationErrors.length

  onEditSubmit: (e) ->
    e.preventDefault()
    form = document.querySelector('.talk-edit-discussion-form')
    boardSelect = form.querySelector('select')

    title = form.querySelector('[name="title"]').value
    sticky = form.querySelector('[name="sticky"]').checked
    locked = form.querySelector('[name="locked"]').checked
    board_id = boardSelect.options[boardSelect.selectedIndex].value

    @discussionsRequest().update({title, sticky, locked, board_id}).save()
      .then (discussion) =>
        {owner, name} = @props.params
        discussionRoute = if (owner and name) then 'project-talk-discussion' else 'talk-discussion'
        @transitionTo discussionRoute, merge(@props.params, board: board_id), @props.query

  lockedMessage: ->
    <div className="talk-discussion-locked">
      <i className="fa fa-lock"></i> This discussion has been Locked and is read-only
    </div>

  onClickEditTitle: ->
    @setState {editingTitle: not @state.editingTitle}

  onChangeTitle: (e) ->
    e.preventDefault()
    title = findDOMNode(@refs.editTitle).value
    @discussionsRequest().update({title}).save()
      .then (discussion) =>
        @setState {editingTitle: false}
        @setDiscussion()
      .catch (e) =>
        @setState {editingTitle: false}

  render: ->
    {discussion} = @state

    <div className="talk-discussion">
      {if not @state.editingTitle
        <h1 className="talk-page-header">
          {discussion?.title}

          {if discussion?.user_id is @props.user?.id
            <span>
              {' '}<i className="fa fa-pencil" title="Edit Title" onClick={@onClickEditTitle}/>
            </span>
            }
        </h1>
      else
        <h1>
          <input ref="editTitle" type="text" defaultValue={discussion?.title} onBlur={@onChangeTitle}/>
        </h1>
        }

      {if discussion && @props.user?
        <Moderation section={discussion.section} user={@props.user}>
          <div>
            <h2>Moderator Zone:</h2>
            {if discussion?.title
              <form className="talk-edit-discussion-form" onSubmit={@onEditSubmit}>
                <h3>Edit Title:</h3>
                <input name="title" type="text" defaultValue={discussion?.title}/>
                <label className="toggle">Sticky:
                  <input name="sticky" type="checkbox" defaultChecked={discussion?.sticky}/>
                </label>
                <label className="toggle">Locked:
                  <input name="locked" type="checkbox" defaultChecked={discussion?.locked}/>
                </label>

                <PromiseRenderer promise={talkClient.type('boards').get({section: discussion.section, page_size: 100})}>{(boards) =>
                  <div>
                    <p><strong>Board:</strong></p>
                    <select onChange={@onChangeSelect}>
                      {boards.map (board, i) =>
                        <option key={board.id} value={board.id} selected={board.id is discussion.board_id}>{board.title}</option>
                        }
                    </select>
                  </div>
                }</PromiseRenderer>

                <button type="submit">Update</button>
              </form>}

            <button onClick={@onClickDeleteDiscussion}>
              Delete this discussion <i className="fa fa-close" />
            </button>
          </div>
        </Moderation>}

      {if discussion?.locked
        @lockedMessage()
        }

      <Paginator page={+@state.commentsMeta.page} pageCount={@state.commentsMeta.page_count} />

      <div className="talk-discussion-comments #{if discussion?.locked then 'locked' else ''}">
        {@state.comments.map(@comment)}
      </div>

      <Paginator page={+@state.commentsMeta.page} pageCount={@state.commentsMeta.page_count} />

      {if discussion?.locked
        @lockedMessage()
      else if @props.user?
        <section>
          <div className="talk-comment-author">
            <Avatar user={@props.user} />
            <p>
              <Link to="user-profile" params={name: @props.user.login}>{@props.user.display_name}</Link>
            </p>
            <div className="user-mention-name">@{@props.user.login}</div>
            <PromiseRenderer promise={talkClient.type('roles').get(user_id: @props.user.id, section: ['zooniverse', discussion.section], is_shown: true, page_size: 100)}>{(roles) =>
              <DisplayRoles roles={roles} section={discussion.section} />
            }</PromiseRenderer>
          </div>

          <CommentBox
            user={@props.user}
            validationCheck={@commentValidations}
            validationErrors={@state.commentValidationErrors}
            onSubmitComment={@onSubmitComment}
            reply={@state.reply}
            header={null} />
        </section>
      else
        <p>Please <span className="sign-in" onClick={@promptToSignIn}>sign in</span> to contribute to the discussion</p>}
    </div>
