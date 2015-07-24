React = require 'react'
Markdown = require './markdown'
alert = require '../lib/alert'
NOOP = Function.prototype
m = require '../lib/markdown-insert'

DEFAULT_MARKDOWN_HELP = <p className="markdown-editor-help"><a href="http://markdownlivepreview.com/" target="_blank">Learn more about markdown</a></p>

module.exports = React.createClass
  displayName: 'MarkdownEditor'

  getDefaultProps: ->
    name: ''
    value: ''
    placeholder: ''
    rows: 5
    onChange: NOOP

  getInitialState: ->
    previewing: false

  onInsertLinkClick: (e) ->
    @wrapSelectionIn(m.hrefLink)

  onInsertImageClick: (e) ->
    @wrapSelectionIn(m.imageLink)

  onBoldClick: (e) ->
    console.log(e)
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

  render: ->
    previewing = @props.previewing ? @state.previewing

    <div className={['markdown-editor', @props.className].join ' '} data-previewing={@state.previewing or null}>
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
        <span className="markdown-editor-controls">
          <button type="button" onClick={@handlePreviewToggle}>
            {if previewing
              <i className="fa fa-pencil fa-fw"></i>
            else
              <i className="fa fa-eye fa-fw"></i>}
          </button>

          <button type="button" onClick={@handleHelpRequest}>
            <i className="fa fa-question fa-fw"></i>
          </button>
        </span>
      </div>

      <div className="editor-area">
        <textarea ref="textarea" className="markdown-editor-input" name={@props.name} placeholder={@props.placeholder} value={@props.value} rows={@props.rows} cols={@props.cols} onChange={@props.onChange} />

        <Markdown className="markdown-editor-preview">{@props.value}</Markdown>
      </div>

    </div>

  handlePreviewToggle: (e) ->
    @setState previewing: not @state.previewing

  handleHelpRequest: ->
    alert @props.helpText or DEFAULT_MARKDOWN_HELP

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
