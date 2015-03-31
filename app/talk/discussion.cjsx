React = require 'react'
Comment = require './comment'
CommentBox = require './comment-box'
commentValidations = require './lib/comment-validations'
{getErrors} = require './lib/validations'
SubjectDisplay = require './subject-display'
Router = require 'react-router'
talkClient = require '../api/talk'
authClient = require '../api/auth'
Paginator = require './lib/paginator'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
PromiseToSetState = require '../lib/promise-to-set-state'
upvotedByCurrentUser = require './lib/upvoted-by-current-user'
Moderation = require './lib/moderation'
{timestamp} = require './lib/time'
{Link} = require 'react-router'
merge = require 'lodash.merge'

module?.exports = React.createClass
  displayName: 'TalkDiscussion'
  mixins: [Router.Navigation, PromiseToSetState]

  getInitialState: ->
    comments: []
    discussion: {}
    commentsMeta: {}
    user: null
    commentValidationErrors: []

  componentDidMount: ->
    @handleAuthChange()
    authClient.listen @handleAuthChange

  componentWillUnmount: ->
    authClient.stopListening @handleAuthChange

  handleAuthChange: ->
    @promiseToSetState user: authClient.checkCurrent()

  goToPage: (n) ->
    @transitionTo(@props.path, @props.params, {page: n})
    @setComments(n)

  componentWillMount: ->
    @setDiscussion()
    page = @props.query?.page ? 1
    @setComments(page)

  commentsRequest: (page) ->
    {board, discussion} = @props.params
    talkClient.type('comments').get({discussion_id: discussion, page_size: 3, page})

  discussionsRequest: ->
    {discussion} = @props.params
    talkClient.type('discussions').get({id: discussion})

  setComments: (page = 1, callback) ->
    @commentsRequest(page)
      .then (comments) =>
        commentsMeta = comments[0]?.getMeta()
        @setState {comments, commentsMeta}, =>
          callback?()
      .catch (e) =>
        console.log "e", e

  setDiscussion: ->
    @discussionsRequest()
      .then (discussion) => @setState {discussion: discussion[0]}
      .catch (e) => console.log "e", e

  onUpdateComment: (textContent, focusImage, commentId) ->
    {discussion} = @props.params
    commentToUpdate = talkClient.type('comments').get(id: commentId)

    discussion_id = +discussion
    body = textContent
    focus_id = +focusImage?.id ? null
    comment = merge {}, {discussion_id, body}, ({focus_id} if !!focus_id)

    commentToUpdate.update(comment).save()
      .then (comment) =>
        @setComments()
      .catch (e) =>
        console.log "comment update error", e

  onDeleteComment: (commentId) ->
    {board, discussion} = @props.params
    if window.confirm("Are you sure that you want to delete this comment?")
      talkClient.type('comments').get(id: commentId).delete()
        .then (deleted) => @setComments()
        .catch (e) => console.log "error deleting comment", e

  onSubmitComment: (e, textContent, focusImage) ->
    {discussion} = @props.params
    user_id = @state.user.id
    discussion_id = +discussion
    body = textContent
    focus_id = +focusImage?.id ? null
    comment = merge {}, {user_id, discussion_id, body}, ({focus_id} if !!focus_id)

    talkClient.type('comments').create(comment).save()
      .then (comment) =>
        @setComments(@state.commentsMeta?.page, => @goToPage(@state.commentsMeta?.page_count))
      .catch (e) =>
        console.log "comment create error", e

  onLikeComment: (commentId) ->
    user = @state.user

    talkClient.type('comments').get(commentId.toString())
      .then (comment) =>
        return alert("Hey you can't upvote your own comment!") if +user.id is +comment.user_id

        voteUrl = (comment.href + if upvotedByCurrentUser(user, comment) then '/remove_upvote' else '/upvote')
        talkClient.request('put', voteUrl, null, {})
          .then (voted) =>
            @setComments(@state.commentsMeta?.page)
          .catch (e) -> console.log "error upvoting", e
      .then (e) -> console.log "error retreiving liked comment"

  onClickReply: (user, comment) ->
    # TODO: provide link to user / comment
    reply = "> In reply to #{user.display_name}'s comment: \n#{comment.body}\n\n"
    @setState {reply}

  comment: (data, i) ->
    <Comment
      key={i}
      data={data}
      user={@state.user}
      onClickReply={@onClickReply}
      onLikeComment={@onLikeComment}
      onUpdateComment={@onUpdateComment}
      onDeleteComment={@onDeleteComment}/>

  onPageChange: (page) ->
    @goToPage(page)

  onClickDeleteDiscussion: ->
    if window.confirm("Are you sure that you want to delete this discussions? All of the comments and discussions will be lost forever.")
      @discussionsRequest().delete()
        .then (deleted) =>
          @setComments()
          @transitionTo('talk')
        .catch (e) -> console.log "error deleting", e

  commentValidations: (commentBody) ->
    # TODO: return true if any additional validations fail
    commentValidationErrors = getErrors(commentBody, commentValidations)
    @setState {commentValidationErrors}
    !!commentValidationErrors.length

  onEditTitle: (e) ->
    input = document.querySelector('.talk-edit-discussion-title-form input')
    title = input.value

    @discussionsRequest().update({title}).save()
      .then (discussion) =>
        @setState {discussion: discussion[0]}
      .catch (e) ->
        console.log "error on edit board title", e

  render: ->
    <div className="talk-discussion">
      <h1 className="talk-page-header">{@state.discussion?.title}</h1>

      <Moderation>
        <div>
          <h2>Moderator Zone:</h2>
          {if @state.discussion?.title
            <form className="talk-edit-discussion-title-form" onSubmit={@onEditTitle}>
              <h3>Edit Title:</h3>
              <input onChange={@onChangeTitle} defaultValue={@state.discussion?.title}/>
              <button type="submit">Update Title</button>
            </form>}

          <button onClick={@onClickDeleteDiscussion}>
            Delete this discussion <i className="fa fa-close" />
          </button>
        </div>
      </Moderation>

      {@state.comments.map(@comment)}

      <Paginator page={+@state.commentsMeta.page} onPageChange={@onPageChange} pageCount={@state.commentsMeta.page_count} />

      <ChangeListener target={authClient}>{=>
        <PromiseRenderer promise={authClient.checkCurrent()}>{(user) =>
          if user
            <section>
              <div className="talk-comment-author">
                <img src={user.avatar} />
                <p>
                  <Link to="user-profile" params={name: user.display_name}>{user.display_name}</Link>
                </p>
              </div>

              <CommentBox
                validationCheck={@commentValidations}
                validationErrors={@state.commentValidationErrors}
                onSubmitComment={@onSubmitComment}
                reply={@state.reply}
                header={null} />
            </section>
          else
            <p>Please sign in to contribute to the disucssion</p>
        }</PromiseRenderer>
      }</ChangeListener>
    </div>
