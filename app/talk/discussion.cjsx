React = require 'react'
ReactDOM = require 'react-dom'
Comment = require './comment'
CommentBox = require './comment-box'
commentValidations = require './lib/comment-validations'
{getErrors} = require './lib/validations'
talkClient = require 'panoptes-client/lib/talk-client'
Paginator = require './lib/paginator'
SingleSubmitButton = require '../components/single-submit-button'
upvotedByCurrentUser = require './lib/upvoted-by-current-user'
Moderation = require './lib/moderation'
{Link} = require 'react-router'
Avatar = require '../partials/avatar'
DisplayRoles = require './lib/display-roles'
talkConfig = require './config'
SignInPrompt = require '../partials/sign-in-prompt'
alert = require '../lib/alert'
merge = require 'lodash.merge'
FollowDiscussion = require './follow-discussion'
PopularTags = require './popular-tags'
ActiveUsers = require './active-users'
ProjectLinker = require './lib/project-linker'

PAGE_SIZE = talkConfig.discussionPageSize

module.exports = React.createClass
  displayName: 'TalkDiscussion'

  contextTypes:
    router: React.PropTypes.object.isRequired

  getInitialState: ->
    comments: []
    discussion: {}
    commentsMeta: {}
    commentValidationErrors: []
    editingTitle: false
    reply: null
    moderationOpen: false
    boards: []

  getDefaultProps: ->
    location: query: page: 1

  promptToSignIn: ->
    alert (resolve) -> <SignInPrompt onChoose={resolve} />

  componentWillReceiveProps: (nextProps) ->
    if @props.params.discussion isnt nextProps.params.discussion
      @setDiscussion(nextProps.params.discussion)
        .then => @setComments(nextProps.location.query.page ? 1)
    else if nextProps.location.query.page isnt @props.location.query.page
      @setComments(nextProps.location.query.page)

  componentDidMount: ->
    @shouldScrollToBottom = true if @props.location.query?.scrollToLastComment

  componentWillMount: ->
    @setDiscussion().then =>
      if @props.location.query?.comment
        commentId = @props.location.query.comment
        comments = @state.discussion.links.comments
        commentNumber = comments.indexOf(commentId) + 1
        page = Math.ceil commentNumber / PAGE_SIZE

        if page isnt @props.location.query.page
          @props.location.query.page = page
          @context.router.replace
            pathname: @props.location.pathname
            query: @props.location.query

      @setComments(@props.location.query.page ? 1)
    
    if @props.user?
      talkClient
        .type 'roles'
        .get 
          user_id: @props.user.id
          section: ['zooniverse', @state.discussion.section]
          is_shown: true
          page_size: 100
        .then (roles) =>
          @setState {roles}

  commentsRequest: (page) ->
    {board, discussion} = @props.params
    talkClient.type('comments').get({discussion_id: discussion, page_size: PAGE_SIZE, page})

  setComments: (page = @props.location.query?.page) ->
    @commentsRequest(page)
      .then (comments) =>
        if comments.length
          commentsMeta = comments[0]?.getMeta() ? {}
          @setState {comments, commentsMeta}, =>
            if @shouldScrollToBottom
              @scrollToBottomOfDiscussion()
              @shouldScrollToBottom = false
        else
          {board, owner, name} = @props.params
          if (owner and name)
            @context.router.push "/projects/#{owner}/#{name}/talk/#{board}"
          else
            @context.router.push "/talk/#{board}"

  setCommentsMeta: (page = @props.location.query?.page) ->
    @commentsRequest(page).then (comments) =>
      commentsMeta = comments[0]?.getMeta() ? {}
      @setState {commentsMeta}

  scrollToBottomOfDiscussion: ->
    ReactDOM.findDOMNode(@)?.scrollIntoView(false)

  discussionsRequest: (discussion = @props.params.discussion) ->
    talkClient.type('discussions').get({id: discussion, sort_linked_comments: 'created_at'})

  setDiscussion: (discussion = @props.params.discussion) ->
    @discussionsRequest(discussion)
      .then (discussion) =>
        @setState {discussion: discussion[0]}
        
        talkClient
          .type 'boards'
          .get
            section: discussion[0].section
            page_size: 100
          .then (boards) =>
            @setState {boards}

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
        @setComments(@props.location.query.page)

  onDeleteComment: (commentId) ->
    {board, discussion} = @props.params
    if window.confirm("Are you sure that you want to delete this comment?")
      talkClient.type('comments').get(id: commentId).delete()
        .then (deleted) => @setComments(@props.location.query.page)

  onSubmitComment: (e, textContent, subject, reply) ->
    {discussion} = @props.params
    user_id = @props.user.id
    discussion_id = +discussion
    body = textContent
    focus_id = +subject?.id ? null
    reply_id = reply.comment.id if reply
    focus_type = 'Subject' if !!focus_id

    comment = merge {},
      {user_id, discussion_id, body},
      {focus_id, focus_type} if !!focus_id,
      {reply_id} if reply

    talkClient.type('comments').create(comment).save()
      .then (comment) =>
        @setCommentsMeta().then =>
          @setComments(@state.commentsMeta?.page_count)
          @setState {reply: null}

  onLikeComment: (commentId) ->
    talkClient.type('comments').get(commentId)
      .then (comment) =>
        return alert("Hey you can't upvote your own comment!") if +@props.user?.id is +comment.user_id

        voteUrl = (comment.href + if upvotedByCurrentUser(@props.user, comment) then '/remove_upvote' else '/upvote')
        talkClient.request('put', voteUrl, null, {})
          .then (voted) =>
            @setComments(@props.location.query.page)

  onClickReply: (comment) ->
    if (not @props.user)
      @promptToSignIn()
    else
      @setState reply: comment: comment

    ReactDOM.findDOMNode(@).scrollIntoView(false)

  comment: (data, i) ->
    <Comment
      {...@props}
      project={@props.project}
      key={data.id}
      index={i}
      data={data}
      active={+data.id is +@props.location.query?.comment}
      user={@props.user}
      locked={@state.discussion?.locked}
      project={@props.project}
      onClickReply={@onClickReply}
      onLikeComment={@onLikeComment}
      onUpdateComment={@onUpdateComment}
      onDeleteComment={@onDeleteComment}/>

  onClickDeleteDiscussion: ->
    deletePhrase = 'delete'
    if window.prompt("Are you sure that you want to delete this discussion? All of the comments and discussions will be lost forever. Please type \"#{deletePhrase}\" in the box below to confirm:") is deletePhrase
      @discussionsRequest().delete()
        .then (deleted) =>
          @setComments(@props.location.query.page)
          {owner, name} = @props.params
          if (owner and name)
            @context.router.push "/projects/#{owner}/#{name}/talk"
          else
            @context.router.push "/talk"

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
        if discussion[0].board_id isnt @props.params.board
          {owner, name} = @props.params

          if (owner and name)
            @context.router.push
              pathname: "/projects/#{owner}/#{name}/talk/#{board_id}/#{}"
              query: @props.location.query
          else
            @context.router.push
              pathname: "/talk/#{board_id}/"
              query: @props.location.query
        else
          @setDiscussion()

  lockedMessage: ->
    <div className="talk-discussion-locked">
      <i className="fa fa-lock"></i> This discussion has been Locked and is read-only
    </div>

  onClickEditTitle: ->
    @setState {editingTitle: not @state.editingTitle}

  onChangeTitle: (e) ->
    e.preventDefault()
    title = @refs.editTitle.value
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

      {if discussion and @props.user?
        <div className="talk-moderation">
          <Moderation user={@props.user} section={@props.section}>
            <button onClick={=> @setState moderationOpen: !@state.moderationOpen}>
              <i className="fa fa-#{if @state.moderationOpen then 'close' else 'warning'}" /> Moderator Controls
            </button>
          </Moderation>

          {if @state.moderationOpen
            <div className="talk-moderation-children talk-module">
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

                  <div>
                    <p><strong>Board:</strong></p>
                    <select defaultValue={discussion.board_id}>
                      {@state.boards.map (board, i) =>
                        <option key={board.id} value={board.id}>{board.title}</option>
                        }
                    </select>
                  </div>

                  <SingleSubmitButton type="submit" onClick={@onEditSubmit}>Update</SingleSubmitButton>
                </form>}

              <SingleSubmitButton onClick={@onClickDeleteDiscussion}>
                Delete this discussion <i className="fa fa-close" />
              </SingleSubmitButton>
            </div>
          }
        </div>
      }

      {if discussion?.locked
        @lockedMessage()
        }

      {if discussion and @props.user
        <FollowDiscussion user={@props.user} discussion={discussion} />
      }
      <Paginator page={+@state.commentsMeta.page} pageCount={@state.commentsMeta.page_count} />

      <div className="talk-list-content">
        <section>
          <div className="talk-discussion-comments #{if discussion?.locked then 'locked' else ''}">
            {@state.comments.map(@comment)}
          </div>
        </section>

        <div className="talk-sidebar">
          <section>
            <PopularTags
              header={<h3>Popular Tags:</h3>}
              section={@props.section}
              project={@props.project} />
          </section>

          <section>
            <ActiveUsers section={@props.section} project={@props.project}/>
          </section>

          <section>
            <h3>Projects:</h3>
            <ProjectLinker user={@props.user} />
          </section>
        </div>
      </div>

      <Paginator page={+@state.commentsMeta.page} pageCount={@state.commentsMeta.page_count} />

      {if discussion?.locked
        @lockedMessage()
      else if @props.user?
        baseLink = "/"
        if @props.project?
          baseLink += "projects/#{@props.project.slug}/"
        <section>
          <div className="talk-comment-author">
            <Avatar user={@props.user} />
            <p>
              <Link to="#{baseLink}users/#{@props.user.login}">{@props.user.display_name}</Link>
            </p>
            <div className="user-mention-name">@{@props.user.login}</div>
            <DisplayRoles roles={@state.roles} section={discussion.section} />
          </div>

          <CommentBox
            user={@props.user}
            project={@props.project}
            validationCheck={@commentValidations}
            validationErrors={@state.commentValidationErrors}
            onSubmitComment={@onSubmitComment}
            reply={@state.reply}
            logSubmit={true}
            onClickClearReply={=> @setState({reply: null})}
            header={null} />
        </section>
      else
        <p>Please <button className="link-style" type="button" onClick={@promptToSignIn}>sign in</button> to contribute to the discussion</p>}
    </div>
