React = require 'react'
Markdown = require './markdown'
alert = require '../lib/alert'

NOOP = Function.prototype

module.exports = React.createClass
  displayName: 'MarkdownEditor'

  getDefaultProps: ->
    placeholder: ''
    value: ''
    onChange: NOOP

  getInitialState: ->
    previewing: false

  getDefaultProps: ->
    rows: '5'

  render: ->
    previewing = @props.previewing ? @state.previewing

    <div className={['markdown-editor', @props.className].join ' '} data-previewing={@state.previewing or null}>
      <textarea className="markdown-editor-input" rows={@props.rows} value={@props.value ? @state.value} onChange={@handleChange} />

      <Markdown className="markdown-editor-preview">{@props.value}</Markdown>

      <div className="markdown-editor-controls">
        <button type="button" onClick={@handlePreviewToggle}>
          {if previewing
            <i className="fa fa-pencil fa-fw"></i>
          else
            <i className="fa fa-eye fa-fw"></i>}
        </button>

        <br />

        <button type="button" onClick={@handleHelpRequest}>
          <i className="fa fa-question fa-fw"></i>
        </button>
      </div>
    </div>

  handlePreviewToggle: (e) ->
    @setState previewing: not @state.previewing

  handleHelpRequest: ->
    alert <p>TODO: Show a dialog with Markdown help.</p>
