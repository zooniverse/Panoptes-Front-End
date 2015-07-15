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
talkConfig = require './config'

PAGE_SIZE = talkConfig.discussionPageSize

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
    @shouldScrollToBottom = true if @props.query?.scrollToLastComment
    @handleAuthChange()
    authClient.listen @handleAuthChange

  componentWillUnmount: ->
    authClient.stopListening @handleAuthChange

  handleAuthChange: ->
    @promiseToSetState user: authClient.checkCurrent()

  goToPage: (n) ->
    {owner, name} = @props.params
    projectPrefix = if (owner and name) then 'project-' else ''
    @transitionTo("#{projectPrefix}talk-discussion", @props.params, {page: n})

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
          if @shouldScrollToBottom and comments.length
            @scrollToBottomOfDiscussion()
            @shouldScrollToBottom = false
          callback?()

  scrollToBottomOfDiscussion: ->
    React.findDOMNode(@)?.scrollIntoView(false)

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
        @setComments(@state.commentsMeta?.page)

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

    talkClient.type('comments').get(commentId)
      .then (comment) =>
        return alert("Hey you can't upvote your own comment!") if +user.id is +comment.user_id

        voteUrl = (comment.href + if upvotedByCurrentUser(user, comment) then '/remove_upvote' else '/upvote')
        talkClient.request('put', voteUrl, null, {})
          .then (voted) =>
            @setComments(@state.commentsMeta?.page)

  onClickReply: (user, comment) ->
    # TODO: provide link to user / comment
    quotedComment = comment.body.split("\n")
      .map (line) -> "> #{line}"
      .join("\n")

    reply = "> In reply to #{user.display_name}'s comment: \n#{quotedComment}\n\n"
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

  onEditSubmit: (e) ->
    e.preventDefault()
    form = document.querySelector('.talk-edit-discussion-form')
    title = form.querySelector('[name="title"]').value
    sticky = form.querySelector('[name="sticky"]').checked
    @discussionsRequest().update({title, sticky}).save()
      .then (discussion) =>
        @setState {discussion: discussion[0]}

  render: ->
    {discussion} = @state

    <div className="talk-discussion">
      <h1 className="talk-page-header">{discussion?.title}</h1>

      {if discussion
        <Moderation section={discussion.section}>
          <div>
            <h2>Moderator Zone:</h2>
            {if discussion?.title
              <form className="talk-edit-discussion-form" onSubmit={@onEditSubmit}>
                <h3>Edit Title:</h3>
                <input name="title" defaultValue={discussion?.title}/>
                <label className="toggle-sticky">Sticky:
                  <input name="sticky" type="checkbox" defaultChecked={discussion?.sticky}/>
                </label>
                <button type="submit">Update</button>
              </form>}

            <button onClick={@onClickDeleteDiscussion}>
              Delete this discussion <i className="fa fa-close" />
            </button>
          </div>
        </Moderation>}

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
                <PromiseRenderer promise={talkClient.type('roles').get(user_id: user.id, section: ['zooniverse', discussion.section], is_shown: true, page_size: 100)}>{(roles) =>
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
