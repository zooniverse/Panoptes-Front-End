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
        <input type="text" ref="titleInput" defaultValue={@props.title} disabled={@props.working} />
      </label>
      <br />

      <label>
        Content<br />
        <textarea ref="contentInput" defaultValue={@props.content} disabled={@props.working} />
      </label>

      <hr />

      <label>
        <button type="button" disabled={@props.working} onClick={@cancel}>Cancel</button>
      </label>{' '}

      <label>
        <button type="submit" disabled={@props.working}>Done</button>
      </label>{' '}

      {if @props.working
        <strong>···</strong>}
    </form>

module.exports = ArticleEditor
