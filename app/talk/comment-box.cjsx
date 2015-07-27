React = require 'react'
ToggleChildren = require './mixins/toggle-children'
Feedback = require './mixins/feedback'
CommentPreview = require './comment-preview'
CommentHelp = require './comment-help'
CommentImageSelector = require './comment-image-selector'
getSubjectLocation = require '../lib/get-subject-location'
Loading = require '../components/loading-indicator'
MarkdownEditor = require '../components/markdown-editor'

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
    content: null
    subject: null
    user: null

  getInitialState: ->
    subject: @props.subject
    content: @props.content
    reply: ''
    loading: false
    error: ''

  componentWillReceiveProps: (nextProps) ->
    if nextProps.reply
      @setState {reply: nextProps.reply}

  onSubmitComment: (e) ->
    e.preventDefault()
    textareaValue = @state.content
    return if @props.validationCheck?(textareaValue)
    @setState loading: true
    fullComment = @state.reply.concat(textareaValue)

    @props.onSubmitComment?(e, fullComment, @state.subject)
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

  onClearImageClick: (e) ->
    @setState subject: null

  render: ->
    validationErrors = @props.validationErrors.map (message, i) =>
      <p key={i} className="talk-validation-error">{message}</p>

    feedback = @renderFeedback()
    loader = if @state.loading then <Loading />

    <div className="talk-comment-box">
      <h1>{@props.header}</h1>

      {if @state.subject
        <img className="talk-comment-focus-image" src={getSubjectLocation(@state.subject).src} />}

      <form className="talk-comment-form" onSubmit={@onSubmitComment}>
        {if @state.reply
          <div>
            <button onClick={=> @setState({reply: ''})}>&times; Remove reply</button>
            <CommentPreview header={null} content={@state.reply}/>
          </div>}

        <MarkdownEditor placeholder={@props.placeholder} className="full" value={@state.content} onChange={@onInputChange} helpText={<CommentHelp />}/>

        <section>
          <button
            type="button"
            className="talk-comment-image-select-button #{if @state.showing is 'image-selector' then 'active' else ''}"
            onClick={@onImageSelectClick}>
            Linked Image
            {if @state.showing is 'image-selector' then <span>&nbsp;<i className="fa fa-close" /></span>}
          </button>

        <button type="submit" className='talk-comment-submit-button'>{@props.submit}</button>
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
