React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
ReactDOM = require 'react-dom'
ToggleChildren = require './mixins/toggle-children'
commentValidations = require './lib/comment-validations'
{getErrors} = require './lib/validations'
Feedback = require './mixins/feedback'
CommentBox = require './comment-box'
CommentReportForm = require './comment-report-form'
CommentLink = require './comment-link'
upvotedByCurrentUser = require './lib/upvoted-by-current-user'
{Link} = require 'react-router'
{timestamp} = require './lib/time'
talkClient = require 'panoptes-client/lib/talk-client'
Avatar = require '../partials/avatar'
SubjectViewer = require '../components/subject-viewer'
`import SVGRenderer from '../components/svg-renderer';` 
SingleSubmitButton = require '../components/single-submit-button'
DisplayRoles = require './lib/display-roles'
CommentContextIcon = require './lib/comment-context-icon'
`import WrappedMarkdown from '../components/wrapped-markdown';`
DEFAULT_AVATAR = '/assets/simple-avatar.png'

module.exports = createReactClass
  displayName: 'TalkComment'
  mixins: [ToggleChildren, Feedback]

  propTypes:
    data: PropTypes.object # Comment resource
    onUpdateComment: PropTypes.func # passed (textContent, subject, commentId) on update submit
    onDeleteComment: PropTypes.func # passed (commentId) on click
    onLikeComment: PropTypes.func # passed (commentId) on like
    onClickReply: PropTypes.func # passed (user, comment) on click
    active: PropTypes.bool  # optional active switch: scroll window to comment and apply styling
    user: PropTypes.object  # Current user
    index: PropTypes.number # The index of the comment in a discussion
    locked: PropTypes.bool  # disable action buttons
    linked: PropTypes.bool
    hideFocus: PropTypes.bool # Control visibility of focus (default: false)

  getDefaultProps: ->
    active: false
    locked: false
    linked: false
    hideFocus: false

  getInitialState: ->
    editing: false
    commentValidationErrors: []
    replies: []

  contextTypes:
    geordi: PropTypes.object

  logItemClick: (itemClick) ->
    @context.geordi?.logEvent
      type: itemClick


  componentDidMount: ->
    if @props.scrollIntoView
      ReactDOM.findDOMNode(@).scrollIntoView()

  onClickReply: (e) ->
    @logItemClick 'reply-post'
    @props.onClickReply(@props.data)

  onClickLink: (e) ->
    @logItemClick 'link-post'
    @toggleComponent('link')

  onClickReport: (e) ->
    @logItemClick 'report-post'
    @toggleComponent('report')

  onClickEdit: (e) ->
    @logItemClick 'edit-post'
    ReactDOM.findDOMNode(@).scrollIntoView()
    @setState editing: true
    @removeFeedback()

  onClickDelete: (e) ->
    @logItemClick 'delete-post'
    @props.onDeleteComment(@props.data.id)

  onCancelClick: (e) ->
    @setState editing: false

  onSubmitComment: (e, textContent, subject) ->
    @logItemClick 'update-comment'
    @props.onUpdateComment?(textContent, subject, @props.data.id)
      .then =>
        @setState editing: false
        @setFeedback "Comment Updated"

  commentValidations: (commentBody) ->
    commentValidationErrors = getErrors(commentBody, commentValidations)
    @setState {commentValidationErrors}
    !!commentValidationErrors.length

  onClickLike: ->
    @logItemClick 'like-post'
    @props.onLikeComment(@props.data.id)

  upvoteCount: ->
    Object.keys(@props.data.upvotes).length

  commentSubjectTitle: (comment, subject) ->
    {owner, name} = @props.params
    if (comment.focus_type is 'Subject') and (owner and name)
      <Link to="/projects/#{owner}/#{name}/talk/subjects/#{comment.focus_id}" onClick={@logItemClick.bind this, "view-subject-direct"}>
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
    baseLink = "/"
    if @props.project?
      baseLink += "projects/#{@props.project.slug}/"
    <div key={comment.id} className="comment-reply-line" ref="comment-reply-#{comment.id}">
      <p>
        <Link to="#{baseLink}users/#{comment.user_login}">{comment.user_display_name}</Link>
        {if comment.reply_id
          <span>
            {' '}in reply to <Link to="#{baseLink}users/#{comment.reply_user_login}">{comment.reply_user_display_name}</Link>&apos;s{' '}
            <button className="link-style" type="button" onClick={(e) => @onClickRenderReplies(e, comment)}>
              comment
            </button>
          </span>
          }
      </p>
      <WrappedMarkdown project={@props.project} content={comment.body} />
    </div>

  # Render the focus if the comment has a focus AND
  #   - @props.hideFocus isn't true
  #   - it's not in a discussion (recents) OR
  #   - it's a focused discussion and this is the first comment OR
  #   - it's not a focused discussion OR
  #   - it's a focused discussion and this comment's focus is different
  shouldShowFocus: ->
    return false unless @props.subject?
    return false if @props.hideFocus

    notInDiscussion = not @props.index
    isFirstSubjectComment = @props.index is 0 and @props.data.discussion_focus_id
    isDifferentFocus = @props.data.focus_id isnt @props.data.discussion_focus_id

    notInDiscussion or isFirstSubjectComment or isDifferentFocus

  render: ->
    feedback = @renderFeedback()
    activeClass = if @props.active then 'active' else ''
    isDeleted = if @props.data.is_deleted then 'deleted' else ''
    profile_link = "/users/#{@props.author?.login}"
    if @props.project?
      profile_link = "/projects/#{@props.project.slug}#{profile_link}"
    author_login = if @props.author?.login then "@#{@props.author.login}" else ""
    <div className="talk-comment #{activeClass} #{isDeleted}">
      <div className="talk-comment-author">
        {<Avatar user={@props.author} /> if @props.author?}
        <div>
          {if @props.author?.login
            <Link to={profile_link}>{@props.data.user_display_name}</Link>
          else
            @props.data.user_display_name}
          <div className="user-mention-name">{author_login}</div>
        </div>
        <DisplayRoles roles={@props.roles} section={@props.data.section} />
      </div>

      <div className="talk-comment-body">
        <CommentContextIcon comment={@props.data}></CommentContextIcon>
        {if @props.data.reply_id
          profile_link = "/users/#{@props.data.reply_user_login}"
          if @props.project?
            profile_link = "/projects/#{@props.project.slug}#{profile_link}"
          <div className="talk-comment-reply">
            {if @state.replies.length
              <div>
                <button type="button" className="clear-replies" onClick={=> @setState(replies: [])}><i className="fa fa-close" /> Clear Replies</button>
                <div>{@state.replies.map(@replyLine)}</div>
              </div>
              }

            In reply to <Link to={profile_link}>{@props.data.reply_user_display_name}</Link>&apos;s{' '}

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
              <div className="polaroid-image">
                {@commentSubjectTitle(@props.data, @props.subject)}
                <SubjectViewer
                  allowInvert={true}
                  frameWrapper={SVGRenderer}
                  linkToFullImage={true}
                  metadataFilters={['#']}
                  project={@props.project}
                  subject={@props.subject}
                  user={@props.user}
                />
              </div>
            }

            <WrappedMarkdown content={@props.data.body} project={@props.project} header={null}/>

            {if @props.linked
              <div style={textAlign: "right"}>
                <CommentLink comment={@props.data} project={@props.project}>
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
            user={@props.user}
            project={@props.project} />}
      </div>
    </div>
