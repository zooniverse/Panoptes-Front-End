React = require 'react'
ToggleChildren = require './mixins/toggle-children'
Feedback = require './mixins/feedback'
MarkdownHelp = require '../partials/markdown-help'
CommentImageSelector = require './comment-image-selector'
getSubjectLocation = require '../lib/get-subject-location'
Loading = require '../components/loading-indicator'
SingleSubmitButton = require '../components/single-submit-button'
alert = require '../lib/alert'
{Markdown, MarkdownEditor} = require 'markdownz'

module?.exports = React.createClass
  displayName: 'Commentbox'
  mixins: [ToggleChildren, Feedback]

  propTypes:
    submit: React.PropTypes.string
    user: React.PropTypes.object
    header: React.PropTypes.string
    placeholder: React.PropTypes.string
    submitFeedback: React.PropTypes.string
    onSubmitComment: React.PropTypes.func # called on submit and passed (e, textarea-content, subject), expected to return something thenable
    onCancelClick: React.PropTypes.func # adds cancel button and calls callback on click if supplied

  getDefaultProps: ->
    submit: "Submit"
    header: "Add to the discussion +"
    placeholder: "Type your comment here"
    submitFeedback: "Comment Successfully Submitted"
    content: ''
    subject: null
    user: null

  getInitialState: ->
    subject: @props.subject
    content: @props.content
    reply: null
    loading: false
    error: ''

  componentWillReceiveProps: (nextProps) ->
    if nextProps.reply isnt @props.reply
      @setState {reply: nextProps.reply}

  onSubmitComment: (e) ->
    e.preventDefault()
    textareaValue = @state.content
    return if @props.validationCheck?(textareaValue)
    @setState loading: true

    @props.onSubmitComment?(e, textareaValue, @state.subject, @state.reply)
      .then =>
        @hideChildren()
        @setState subject: null, content: '', error: '', loading: false
        @setFeedback @props.submitFeedback
      .catch (e) =>
        @setState(error: e.message, loading: false)

  onInputChange: (e) ->
    @setState content: e.target.value

  onImageSelectClick: (e) ->
    @toggleComponent('image-selector')

  onSelectImage: (imageData) ->
    @setState subject: imageData
    @hideChildren()

  onClearImageClick: (e) ->
    @setState subject: null

  render: ->
    validationErrors = @props.validationErrors.map (message, i) =>
      <p key={i} className="talk-validation-error">{message}</p>

    feedback = @renderFeedback()
    loader = if @state.loading then <Loading />

    <div className="talk-comment-box">

      {if @props.reply
        <div className="talk-comment-reply">
          <div style={color: '#afaeae'}>
            In reply to {@props.reply.comment.user_display_name}'s comment:
          </div>
          <Markdown project={@props.project}>{@props.reply.comment.body}</Markdown>
          <button type="button" onClick={@props.onClickClearReply}><i className="fa fa-close" /> Clear Reply</button>
        </div>
        }

      <h1>{@props.header}</h1>

      {if @state.subject
        <img className="talk-comment-focus-image" src={getSubjectLocation(@state.subject).src} />}

      <form className="talk-comment-form" onSubmit={@onSubmitComment}>

        <MarkdownEditor previewing={@state.loading} placeholder={@props.placeholder} project={@props.project} className="full" value={@state.content} onChange={@onInputChange} onHelp={-> alert <MarkdownHelp talk={true} title={<h1>Guide to commenting in Talk</h1>}/> }/>
        <section>
          <button
            type="button"
            className="talk-comment-image-select-button #{if @state.showing is 'image-selector' then 'active' else ''}"
            onClick={@onImageSelectClick}>
            Linked Image
            {if @state.showing is 'image-selector' then <span>&nbsp;<i className="fa fa-close" /></span>}
          </button>

        <SingleSubmitButton type="submit" onClick={@onSubmitComment} className='talk-comment-submit-button'>{@props.submit}</SingleSubmitButton>
          {if @props.onCancelClick
            <button
              type="button"
              className="button talk-comment-submit-button"
              onClick={@props.onCancelClick}>
             Cancel
            </button>}
        </section>

        {feedback}

        <div className="submit-error">
          {validationErrors}
          {@state.error ? null}
        </div>
      </form>

      <div className="talk-comment-children">
        {switch @state.showing
          when 'image-selector'
            <CommentImageSelector
              onSelectImage={@onSelectImage}
              onClearImageClick={@onClearImageClick}
              user={@props.user} />}
      </div>

      {loader}
    </div>
