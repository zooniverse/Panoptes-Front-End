React = require 'react'
ToggleChildren = require './mixins/toggle-children'
Feedback = require './mixins/feedback'
CommentPreview = require './comment-preview'
CommentHelp = require './comment-help'
CommentImageSelector = require './comment-image-selector'
getSubjectLocation = require '../lib/get-subject-location'

m = require './lib/markdown-insert'

module?.exports = React.createClass
  displayName: 'Commentbox'
  mixins: [ToggleChildren, Feedback]

  propTypes:
    submit: React.PropTypes.string
    header: React.PropTypes.string
    placeholder: React.PropTypes.string
    submitFeedback: React.PropTypes.string
    onSubmitComment: React.PropTypes.func # called on submit and passed (e, textarea-content, focusImage)
    onCancelClick: React.PropTypes.func # adds cancel button and calls callback on click if supplied

  getDefaultProps: ->
    submit: "Submit"
    header: "Add to the discussion +"
    placeholder: "Type your comment here"
    submitFeedback: "Comment Successfully Submitted"
    content: null
    focusImage: null

  getInitialState: ->
    focusImage: @props.focusImage
    content: @props.content
    reply: ''

  componentWillReceiveProps: (nextProps) ->
    if nextProps.reply
      @setState {reply: nextProps.reply}

  onSubmitComment: (e) ->
    e.preventDefault()
    textareaValue = @refs.textarea.getDOMNode().value
    return if @props.validationCheck?(textareaValue)

    fullComment = @state.reply.concat(textareaValue)
    @props.onSubmitComment?(e, fullComment, @state.focusImage)
    # optional function called on submit ^
    # TODO: update this submit stuff for better reuse / prod

    @refs.textarea.getDOMNode().value = ""
    @hideChildren()
    @setState content: ""
    @setFeedback @props.submitFeedback

  onPreviewClick: (e) ->
    @toggleComponent('preview')

  onHelpClick: (e) ->
    @toggleComponent('help')

  onImageSelectClick: (e) ->
    @toggleComponent('image-selector')

  onInsertLinkClick: (e) ->
    @wrapSelectionIn(m.hrefLink)

  onInsertImageClick: (e) ->
    @wrapSelectionIn(m.imageLink)

  onBoldClick: (e) ->
    @wrapSelectionIn(m.bold)

  onItalicClick: (e) ->
    @wrapSelectionIn(m.italic)

  onHeadingClick: (e) ->
    @wrapSelectionIn(m.heading, ensureNewLine: true)

  onQuoteClick: ->
    @wrapSelectionIn(m.quote, ensureNewLine: true)

  onHorizontalRuleClick: (e) ->
    @wrapSelectionIn(m.horizontalRule, ensureNewLine: true)

  onStrikethroughClick: (e) ->
    @wrapSelectionIn(m.strikethrough)

  onBulletClick: (e) ->
    @wrapLinesIn(m.bullet, ensureNewLine: true)

  onNumberClick: (e) ->
    @wrapLinesIn(m.numberedList, ensureNewLine: true, incrementLines: true)

  onSelectImage: (imageData) ->
    @setState focusImage: imageData

  onClearImageClick: (e) ->
    @setState focusImage: null

  onInputChange: ->
    @setState content: @refs.textarea.getDOMNode().value

  render: ->
    validationErrors = @props.validationErrors.map (message, i) =>
      <p key={i} className="talk-validation-error">{message}</p>

    feedback = @renderFeedback()

    <div className="talk-comment-box">
      <h1>{@props.header}</h1>

      {if @state.focusImage
        <img className="talk-comment-focus-image" src={getSubjectLocation(@state.focusImage).src} />}

      {feedback}

      <div className="talk-comment-buttons-container">
        <button title="link"className='talk-comment-insert-link-button' onClick={@onInsertLinkClick}>
          <i className="fa fa-link"></i>
        </button>
        <button title="image" className='talk-comment-insert-image-button' onClick={@onInsertImageClick}>
          <i className="fa fa-image"></i>
        </button>
        <button title="bold" className='talk-comment-bold-button' onClick={@onBoldClick}>
          <i className="fa fa-bold"></i>
        </button>
        <button title="italic" className='talk-comment-italic-button' onClick={@onItalicClick}>
          <i className="fa fa-italic"></i>
        </button>
        <button title="block quote" className='talk-comment-insert-quote-button' onClick={@onQuoteClick}>
          <i className="fa fa-quote-left"></i> <i className="fa fa-quote-right"></i>
        </button>
        <button title="heading" className='talk-comment-heading-button' onClick={@onHeadingClick}>
          <i className="fa fa-header"></i>
        </button>
        <button title="horizontal rule" className='talk-comment-hr-button' onClick={@onHorizontalRuleClick}>
          <i className="fa fa-arrows-h"></i>
        </button>
        <button title="strikethrough" className='talk-comment-strikethrough-button' onClick={@onStrikethroughClick}>
          <i className="fa fa-strikethrough"></i>
        </button>
        <button title="bulleted list" className='talk-comment-bullet-button' onClick={@onBulletClick}>
          <i className="fa fa-list"></i>
        </button>
        <button title="numbered list" className='talk-comment-number-button' onClick={@onNumberClick}>
          <i className="fa fa-list-ol"></i>
        </button>
      </div>

      <form className="talk-comment-form" onSubmit={@onSubmitComment}>
        {if @state.reply
          <div>
            <button onClick={=> @setState({reply: ''})}>&times; Remove reply</button>
            <CommentPreview header={null} content={@state.reply}/>
          </div>}

        <textarea value={@state.content} onChange={@onInputChange} ref="textarea" placeholder={@props.placeholder} />
        <section>
          <button
            type="button"
            className="talk-comment-image-select-button #{if @state.showing is 'image-selector' then 'active' else ''}"
            onClick={@onImageSelectClick}>
            Featured Image
            {if @state.showing is 'image-selector' then <span>&nbsp;<i className="fa fa-close" /></span>}
          </button>

          <button
            type="button"
            className="talk-comment-help-button #{if @state.showing is 'help' then 'active' else ''}"
            onClick={@onHelpClick}>
            Help
            {if @state.showing is 'help' then <span>&nbsp;<i className="fa fa-close" /></span>}
          </button>

          <button
            type="button"
            className="talk-comment-preview-button #{if @state.showing is 'preview' then 'active' else ''}"
            onClick={@onPreviewClick}>
            Preview
            {if @state.showing is 'preview' then <span>&nbsp;<i className="fa fa-close" /></span>}
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
        {validationErrors}
      </form>

      <div className="talk-comment-children">
        {switch @state.showing
          when 'image-selector'
            <CommentImageSelector
              onSelectImage={@onSelectImage}
              onClearImageClick= {@onClearImageClick}/>
          when 'preview'
            <CommentPreview content={@state.content} />
          when 'help'
            <CommentHelp />}
      </div>
    </div>

  wrapSelectionIn: (wrapFn, opts = {}) ->
    # helper to call markdown-insert functions on the textarea
    # wrapFn takes / returns a string (from ./lib/markdown-insert.cjsx)

    textarea = @refs.textarea.getDOMNode()
    selection = m.getSelection(textarea)
    {text, cursor} = wrapFn(selection)

    m.insertAtCursor(text, textarea, cursor, opts)
    @onInputChange()

  wrapLinesIn: (wrapFn, opts = {}) ->
    textarea = @refs.textarea.getDOMNode()
    lines = m.getSelection(textarea).split("\n")

    formattedText = lines
      .map (line) -> wrapFn(line).text
      .join("\n")

    # increment the line numbers in a list, if that option is specified
    if opts.incrementLines and opts.ensureNewLine
      begInputValue = textarea.value.substring(0, textarea.selectionStart) + "\n"
      formattedText = m.incrementedListItems(begInputValue, formattedText)

    cursor = {start: formattedText.length, end: formattedText.length}

    m.insertAtCursor(formattedText, textarea, cursor, opts)
    @onInputChange()
