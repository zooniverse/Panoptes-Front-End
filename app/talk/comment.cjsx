React = require 'react'
ToggleChildren = require './mixins/toggle-children'
commentValidations = require './lib/comment-validations'
{getErrors} = require './lib/validations'
Feedback = require './mixins/feedback'
CommentBox = require './comment-box'
CommentReportForm = require './comment-report-form'
CommentLink = require './comment-link'
upvotedByCurrentUser = require './lib/upvoted-by-current-user'
CommentPreview = require './comment-preview'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'
{timestamp} = require './lib/time'
apiClient = require '../api/client'
talkClient = require '../api/talk'
Avatar = require '../partials/avatar'
SubjectViewer = require '../components/subject-viewer'
DisplayRoles = require './lib/display-roles'
merge = require 'lodash.merge'

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

  getDefaultProps: ->
    active: false

  getInitialState: ->
    editing: false
    commentValidationErrors: []

  componentDidMount: ->
    if @props.active
      React.findDOMNode(@).scrollIntoView()

  onClickReply: (e) ->
    apiClient.type('users').get(id: @props.data.user_id).index(0).then (commentOwner) =>
      @props.onClickReply(commentOwner, @props.data)

  onClickLink: (e) ->
    @toggleComponent('link')

  onClickReport: (e) ->
    @toggleComponent('report')

  onClickEdit: (e) ->
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
      <Link
        to="project-talk-subject"
        params={merge {id: comment.focus_id}, {owner, name}}>
        Subject {subject.id}
      </Link>
    else
      <span>Subject {subject.id}</span>

  render: ->
    feedback = @renderFeedback()
    activeClass = if @props.active then 'active' else ''

    <div className="talk-comment #{activeClass}">
      <div className="talk-comment-author">
        <PromiseRenderer promise={apiClient.type('users').get(id: @props.data.user_id).index(0)}>{(commentOwner) =>
          <Avatar user={commentOwner} />
        }</PromiseRenderer>

        <p>
          <Link to="user-profile" params={name: @props.data.user_login}>{@props.data.user_display_name}</Link>
          <div className="user-mention-name">@{@props.data.user_login}</div>
        </p>

        <PromiseRenderer promise={talkClient.type('roles').get(user_id: @props.data.user_id, section: ['zooniverse', @props.data.section], is_shown: true, page_size: 100)}>{(roles) =>
          <DisplayRoles roles={roles} section={@props.data.section} />
        }</PromiseRenderer>
      </div>

      <div className="talk-comment-body">
        {feedback}

        {if not @state.editing
          <div className="talk-comment-content">
            <p className="talk-comment-date">{timestamp(@props.data.created_at)}</p>

            {if @props.data.focus_id
              <PromiseRenderer
                promise={
                  apiClient.type('subjects').get(@props.data.focus_id)
                }
                then={(subject) =>
                  <div className="polaroid-image">
                    {@commentSubjectTitle(@props.data, subject)}
                    <SubjectViewer subject={subject} user={@props.user} />
                  </div>
                }
                catch={null}
                />}

            <CommentPreview content={@props.data.body} header={null}/>

            <div className="talk-comment-links">
              <button className="talk-comment-like-button" onClick={@onClickLike}>
                {if upvotedByCurrentUser(@props.user, @props.data)
                  <i className="fa fa-thumbs-up upvoted" />
                else
                  <i className="fa fa-thumbs-o-up" />}
                &nbsp;{@upvoteCount()}
              </button>

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
                  <button className="talk-comment-delete-button" onClick={@onClickDelete}>
                    <i className="fa fa-remove" /> Delete
                  </button>
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
