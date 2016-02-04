React = require 'react'
ReactDOM = require 'react-dom'
ToggleChildren = require './mixins/toggle-children'
commentValidations = require './lib/comment-validations'
{getErrors} = require './lib/validations'
Feedback = require './mixins/feedback'
CommentBox = require './comment-box'
CommentReportForm = require './comment-report-form'
CommentLink = require './comment-link'
upvotedByCurrentUser = require './lib/upvoted-by-current-user'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'
{timestamp} = require './lib/time'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
Avatar = require '../partials/avatar'
SubjectViewer = require '../components/subject-viewer'
SingleSubmitButton = require '../components/single-submit-button'
DisplayRoles = require './lib/display-roles'
CommentContextIcon = require './lib/comment-context-icon'
merge = require 'lodash.merge'
{Markdown} = require 'markdownz'
DEFAULT_AVATAR = './assets/simple-avatar.jpg'

module?.exports = React.createClass
  displayName: 'TalkComment'
  mixins: [ToggleChildren, Feedback]

  propTypes:
    data: React.PropTypes.object # Comment resource
    onUpdateComment: React.PropTypes.func # passed (textContent, subject, commentId) on update submit
    onDeleteComment: React.PropTypes.func # passed (commentId) on click
    onLikeComment: React.PropTypes.func # passed (commentId) on like
    onClickReply: React.PropTypes.func # passed (user, comment) on click
    active: React.PropTypes.bool  # optional active switch: scroll window to comment and apply styling
    user: React.PropTypes.object  # Current user
    index: React.PropTypes.number # The index of the comment in a discussion
    locked: React.PropTypes.bool  # disable action buttons
    linked: React.PropTypes.bool

  getDefaultProps: ->
    active: false
    locked: false
    linked: false

  getInitialState: ->
    editing: false
    commentValidationErrors: []
    replies: []

  componentDidMount: ->
    if @props.active
      ReactDOM.findDOMNode(@).scrollIntoView()

  onClickReply: (e) ->
    @props.onClickReply(@props.data)

  onClickLink: (e) ->
    @toggleComponent('link')

  onClickReport: (e) ->
    @toggleComponent('report')

  onClickEdit: (e) ->
    React.findDOMNode(@).scrollIntoView()
    @setState editing: true
    @removeFeedback()

  onClickDelete: (e) ->
    @props.onDeleteComment(@props.data.id)

  onCancelClick: (e) ->
    @setState editing: false

  onSubmitComment: (e, textContent, subject) ->
    @props.onUpdateComment?(textContent, subject, @props.data.id)
      .then =>
        @setState editing: false
        @setFeedback "Comment Updated"

  commentValidations: (commentBody) ->
    commentValidationErrors = getErrors(commentBody, commentValidations)
    @setState {commentValidationErrors}
    !!commentValidationErrors.length

  onClickLike: ->
    @props.onLikeComment(@props.data.id)

  upvoteCount: ->
    Object.keys(@props.data.upvotes).length

  commentSubjectTitle: (comment, subject) ->
    {owner, name} = @props.params
    if (comment.focus_type is 'Subject') and (owner and name)
      <Link to="/projects/#{owner}/#{name}/talk/subjects/#{comment.focus_id}">
        Subject {subject.id}
      </Link>
    else
      <span>Subject {subject.id}</span>

  flashHighlightedComment: (commentId) ->
    reply = @refs["comment-reply-#{commentId}"]
    reply.classList.add('highlighted')
    window.setTimeout((=> reply.classList.remove('highlighted')), 500)

  onClickRenderReplies: (e, comment) ->
    if @state.replies.map((c) -> c.id).indexOf(comment.reply_id) isnt -1
      @flashHighlightedComment(comment.reply_id)
    else
      talkClient.type('comments').get(comment.reply_id)
        .then (comment) =>
          @setState replies: [comment].concat(@state.replies)

  replyLine: (comment) ->
    <div key={comment.id} className="comment-reply-line" ref="comment-reply-#{comment.id}">
      <p>
        <Link to="/users/#{comment.user_login}">{comment.user_display_name}</Link>
        {if comment.reply_id
          <span>
            {' '}in reply to <Link to="/users/#{comment.reply_user_login}">{comment.reply_user_display_name}</Link>'s{' '}
            <button className="link-style" type="button" onClick={(e) => @onClickRenderReplies(e, comment)}>
              comment
            </button>
          </span>
          }
      </p>
      <Markdown project={@props.project} content={comment.body} />
    </div>

  # Render the focus if the comment has a focus AND
  #   - it's not in a discussion (recents) OR
  #   - it's a focused discussion and this is the first comment OR
  #   - it's not a focused discussion OR
  #   - it's a focused discussion and this comment's focus is different
  shouldShowFocus: ->
    return false unless @props.data.focus_id

    notInDiscussion = not @props.index
    isFirstSubjectComment = @props.index is 0 and @props.data.discussion_focus_id
    isDifferentFocus = @props.data.focus_id isnt @props.data.discussion_focus_id

    notInDiscussion or isFirstSubjectComment or isDifferentFocus

  render: ->
    feedback = @renderFeedback()
    activeClass = if @props.active then 'active' else ''
    isDeleted = if @props.data.is_deleted then 'deleted' else ''

    <div className="talk-comment #{activeClass} #{isDeleted}">
      <div className="talk-comment-author">
        <PromiseRenderer promise={apiClient.type('users').get(id: @props.data.user_id).index(0)}>{(commentOwner) =>
          <Avatar user={commentOwner} />
        }</PromiseRenderer>

        <div>
          <Link to="/users/#{@props.data.user_login}">{@props.data.user_display_name}</Link>
          <div className="user-mention-name">@{@props.data.user_login}</div>
        </div>

        <PromiseRenderer promise={talkClient.type('roles').get(user_id: @props.data.user_id, section: ['zooniverse', @props.data.section], is_shown: true, page_size: 100)}>{(roles) =>
          <DisplayRoles roles={roles} section={@props.data.section} />
        }</PromiseRenderer>
      </div>

      <div className="talk-comment-body">
        <CommentContextIcon comment={@props.data}></CommentContextIcon>
        {if @props.data.reply_id
          <div className="talk-comment-reply">
            {if @state.replies.length
              <div>
                <button type="button" className="clear-replies" onClick={=> @setState(replies: [])}><i className="fa fa-close" /> Clear Replies</button>
                <div>{@state.replies.map(@replyLine)}</div>
              </div>
              }

            In reply to <Link to="/users/#{@props.data.reply_user_login}">{@props.data.reply_user_display_name}</Link>'s{' '}

            <button className="link-style" type="button" onClick={(e) => @onClickRenderReplies(e, @props.data)}>comment</button>
          </div>
          }

        {feedback}

        {if not @state.editing
          <div className="talk-comment-content">
            {if @props.title
              <div className="talk-comment-title">{@props.title}</div>}
            <p className="talk-comment-date">{timestamp(@props.data.created_at)}</p>

            {if @shouldShowFocus()
              <PromiseRenderer
                promise={
                  apiClient.type('subjects').get(@props.data.focus_id)
                }
                then={(subject) =>
                  <div className="polaroid-image">
                    {@commentSubjectTitle(@props.data, subject)}
                    <SubjectViewer
                      subject={subject}
                      user={@props.user}
                      project={@props.project}
                      linkToFullImage={true}/>
                  </div>
                }
                catch={null}
                />}

            <Markdown content={@props.data.body} project={@props.project} header={null}/>

            {if @props.linked
              <div style={textAlign: "right"}>
                <CommentLink comment={@props.data}>
                  <i className="fa fa-comments-o"/> View the discussion
                </CommentLink>
              </div>
              }

            <div className="talk-comment-links #{if @props.locked then 'locked' else ''}">
              <SingleSubmitButton className="talk-comment-like-button" onClick={@onClickLike}>
                {if upvotedByCurrentUser(@props.user, @props.data)
                  <i className="fa fa-thumbs-up upvoted" />
                else
                  <i className="fa fa-thumbs-o-up" />}
                {' '}Helpful{' '}
                ({@upvoteCount()})
              </SingleSubmitButton>

              <button className="talk-comment-reply-button" onClick={@onClickReply}>
                <i className="fa fa-reply" /> Reply
              </button>
              <button className="talk-comment-link-button" onClick={@onClickLink}>
                <i className="fa fa-link" /> Link
              </button>
              {if @props.user?
                <button className="talk-comment-report-button" onClick={@onClickReport}><i className="fa fa-warning" /> Report</button>}
              {if +@props.data?.user_id is +@props.user?.id
                <span>
                  <button className="talk-comment-edit-button" onClick={@onClickEdit}>
                    <i className="fa fa-pencil" /> Edit
                  </button>
                  <SingleSubmitButton className="talk-comment-delete-button" onClick={@onClickDelete}>
                    <i className="fa fa-remove" /> Delete
                  </SingleSubmitButton>
                </span>}
            </div>

            <div className="talk-comment-children">
              {switch @state.showing
                 when 'link' then <CommentLink comment={@props.data}/>
                 when 'report' then <CommentReportForm comment={@props.data} />}
            </div>
          </div>
        else
          <CommentBox
            header={"Editing Comment..."}
            content={@props.data.body}
            validationCheck={@commentValidations}
            validationErrors={@state.commentValidationErrors}
            submitFeedback={"Updated!"}
            submit={"Update Comment"}
            onCancelClick={@onCancelClick}
            onSubmitComment={@onSubmitComment}
            user={@props.user} />}
      </div>
    </div>
