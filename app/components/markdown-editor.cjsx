# @cjsx React.DOM

React = require 'react'
Markdown = require './markdown'

module.exports = React.createClass
  displayName: 'MarkdownEditor'

  getInitialState: ->
    previewing: false
    value: @props.defaultValue ? ''

  render: ->
    previewing = @props.previewing ? @state.previewing

    <div className={['markdown-editor', @props.className].join ' '} data-previewing={@state.previewing or null}>
      {@transferPropsTo <textarea className="markdown-editor-input" value={@props.value ? @state.value} onChange={@handleChange} />}

      <Markdown className="markdown-editor-preview">{@state.value}</Markdown>

      <div className="markdown-editor-controls">
        <button onClick={@handlePreviewToggle}>
          {if previewing
            <i className="fa fa-pencil"></i>
          else
            <i className="fa fa-eye"></i>}
        </button>

        <br />

        <button onClick={@handleHelpRequest}>
          <i className="fa fa-question"></i>
        </button>
      </div>
    </div>

  handleChange: (e) ->
    unless @props.value?
      @setState value: e.target.value

    @props.onChange? e

  handlePreviewToggle: (e) ->
    @setState previewing: not @state.previewing

  handleHelpRequest: ->
    console?.log 'TODO: Show a dialog with Markdown help.'
