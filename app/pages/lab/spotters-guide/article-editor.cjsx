React = require 'react'

ArticleEditor = React.createClass
  getDefaultProps: ->
    title: ''
    content: ''
    working: false

  getData: ->
    title: React.findDOMNode(this.refs.titleInput).value
    content: React.findDOMNode(this.refs.contentInput).value

  cancel: ->
    @props.onCancel? arguments...

  submit: (e) ->
    e.preventDefault()
    e.stopPropagation()
    data = @getData()
    @props.onSubmit? data, arguments...

  render: ->
    <form method="POST" onSubmit={@submit}>
      <label>
        Title<br />
        <input type="text" ref="titleInput" className="standard-input full" defaultValue={@props.title} disabled={@props.working} autoFocus />
      </label>
      <br />

      <label>
        Content <small>TODO: Markdown editor</small><br />
        <textarea ref="contentInput" className="standard-input full" defaultValue={@props.content} disabled={@props.working} rows="10" cols="100"/>
      </label>
      <br />

      <label>
        <button type="button" className="minor-button" disabled={@props.working} onClick={@cancel}>Cancel</button>
      </label>{' '}

      <label>
        <button type="submit" className="major-button" disabled={@props.working}>Done</button>
      </label>{' '}

      {if @props.working
        <strong>· · ·</strong>}
    </form>

module.exports = ArticleEditor
