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
Avatar = require '../partials/avatar'
DisplayRoles = require './lib/display-roles'

PAGE_SIZE = 10

module?.exports = React.createClass
  displayName: 'TalkDiscussion'
  mixins: [Router.Navigation, PromiseToSetState]

  getInitialState: ->
    comments: []
    discussion: {}
    commentsMeta: {}
    user: null
    commentValidationErrors: []
    isUpdatingTitle: false

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
    talkClient.type('comments').get({discussion_id: discussion, page_size: PAGE_SIZE, page})

  discussionsRequest: ->
    {discussion} = @props.params
    talkClient.type('discussions').get({id: discussion})

  setComments: (page = 1, callback) ->
    @commentsRequest(page)
      .then (comments) =>
        commentsMeta = comments[0]?.getMeta()
        @setState {comments, commentsMeta}, =>
          callback?()

  setDiscussion: ->
    @discussionsRequest()
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
        @setComments()

  onDeleteComment: (commentId) ->
    {board, discussion} = @props.params
    if window.confirm("Are you sure that you want to delete this comment?")
      talkClient.type('comments').get(id: commentId).delete()
        .then (deleted) => @setComments()

  onSubmitComment: (e, textContent, subject) ->
    {discussion} = @props.params
    user_id = @state.user.id
    discussion_id = +discussion
    body = textContent
    focus_id = +subject?.id ? null
    focus_type = 'Subject' if !!focus_id
    comment = merge {}, {user_id, discussion_id, body}, ({focus_id, focus_type} if !!focus_id)

    talkClient.type('comments').create(comment).save()
      .then (comment) =>
        @setComments(@state.commentsMeta?.page, => @goToPage(@state.commentsMeta?.page_count))

  onLikeComment: (commentId) ->
    user = @state.user

    talkClient.type('comments').get(commentId.toString())
      .then (comment) =>
        return alert("Hey you can't upvote your own comment!") if +user.id is +comment.user_id

        voteUrl = (comment.href + if upvotedByCurrentUser(user, comment) then '/remove_upvote' else '/upvote')
        talkClient.request('put', voteUrl, null, {})
          .then (voted) =>
            @setComments(@state.commentsMeta?.page)

  onClickReply: (user, comment) ->
    # TODO: provide link to user / comment
    reply = "> In reply to #{user.display_name}'s comment: \n#{comment.body}\n\n"
    @setState {reply}

  comment: (data, i) ->
    <Comment
      key={data.id}
      data={data}
      active={+data.id is +@props.query?.comment}
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

  commentValidations: (commentBody) ->
    # TODO: return true if any additional validations fail
    commentValidationErrors = getErrors(commentBody, commentValidations)
    @setState {commentValidationErrors}
    !!commentValidationErrors.length

  toggleUpdateDiscussion: ->
    @setState isUpdatingTitle: !@state.isUpdatingTitle

  onModeratorEditTitle: (e) ->
    e.preventDefault()
    @updateTitle React.findDOMNode(@refs.moderatorEditTitleInput).value

  onOwnerEditTitle: (e) ->
    e.preventDefault()
    @updateTitle React.findDOMNode(@refs.ownerEditTitleInput).value

  updateTitle: (title) ->
    @discussionsRequest().update({title}).save()
      .then (discussion) =>
        @setState
          discussion: discussion[0]
          isUpdatingTitle: false

  render: ->
    {discussion} = @state
    discussionOwnerId = discussion?.user_id?.toString()
    userId = @state.user?.id?.toString()

    <div className="talk-discussion">
      <h1 className="talk-page-header">{discussion?.title}</h1>

      {if discussion
        <div>
          <Moderation section={discussion.section}>
            <div>
              <h2>Moderator Zone:</h2>
              {if discussion?.title
                <form className="talk-edit-discussion-title-form" onSubmit={@onModeratorEditTitle}>
                  <h3>Edit Title:</h3>
                  <input ref="moderatorEditTitleInput" defaultValue={discussion?.title}/>
                  <button type="submit">Update Title</button>
                </form>}

              <button onClick={@onClickDeleteDiscussion}>
                Delete this discussion <i className="fa fa-close" />
              </button>
            </div>
          </Moderation>

          {if userId is discussionOwnerId
            style = 
              display: if @state.isUpdatingTitle then 'block' else 'none'

            <div className="talk-update-discussion-container">
              <button className="talk-update-discussion-toggle" type="button" onClick={@toggleUpdateDiscussion}>{if @state.isUpdatingTitle then 'Cancel' else 'Update Discussion'}</button>
              <div className="talk-update-discussion-form-container" style={style}>
                <form className="talk-edit-discussion-title-form" onSubmit={@onOwnerEditTitle}>
                  <h3>Edit Title:</h3>
                  <input ref="ownerEditTitleInput" defaultValue={discussion?.title}/>
                  <button type="submit">Update Title</button>
                </form>
              </div>
            </div>}
        </div>}

      {@state.comments.map(@comment)}

      <Paginator page={+@state.commentsMeta.page} onPageChange={@onPageChange} pageCount={@state.commentsMeta.page_count} />

      <ChangeListener target={authClient}>{=>
        <PromiseRenderer promise={authClient.checkCurrent()}>{(user) =>
          if user?
            <section>
              <div className="talk-comment-author">
                <Avatar user={user} />
                <p>
                  <Link to="user-profile" params={name: user.login}>{user.display_name}</Link>
                </p>
                <div className="user-mention-name">@{user.login}</div>
                <PromiseRenderer promise={talkClient.type('roles').get(user_id: user.id, section: ['zooniverse', discussion.section], is_shown: true)}>{(roles) =>
                  <DisplayRoles roles={roles} section={discussion.section} />
                }</PromiseRenderer>
              </div>

              <CommentBox
                validationCheck={@commentValidations}
                validationErrors={@state.commentValidationErrors}
                onSubmitComment={@onSubmitComment}
                reply={@state.reply}
                header={null} />
            </section>
          else
            <p>Please sign in to contribute to the discussion</p>
        }</PromiseRenderer>
      }</ChangeListener>
    </div>
