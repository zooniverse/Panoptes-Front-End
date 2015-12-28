React = require 'react'
ReactDOM = require 'react-dom'
FileButton = require '../../../components/file-button'
{MarkdownEditor} = require 'markdownz'

ArticleEditor = React.createClass
  statics:
    SHOULD_REMOVE_ICON: {}

  getDefaultProps: ->
    icon: ''
    title: ''
    content: ''
    working: false

  getInitialState: ->
    newIconFile: null
    newIconDataURL: ''
    content: @props.content

  chooseIcon: (e) ->
    newIconFile = e?.target?.files?[0]
    if newIconFile?
      @loadImageAsDataURL(newIconFile).then (newIconDataURL) =>
        @setState {newIconFile, newIconDataURL}
    else
      @resetIcon()

  loadImageAsDataURL: (file) ->
    new Promise (resolve) ->
      reader = new FileReader
      reader.onload = (e) =>
        resolve e.target.result
      reader.readAsDataURL file

  resetIcon: ->
    @setState
      newIconFile: null
      newIconDataURL: ''

  removeIcon: ->
    @resetIcon()
    @setState newIconFile: @constructor.SHOULD_REMOVE_ICON

  getData: ->
    icon: @state.newIconFile
    title: ReactDOM.findDOMNode(this.refs.titleInput).value
    content: @state.content

  cancel: ->
    @props.onCancel? arguments...

  save: (e) ->
    e.preventDefault()
    e.stopPropagation()
    data = @getData()
    @props.onSave? data, arguments...

  render: ->
    <div>
      <p>
        <FileButton accept="image/*" onSelect={@chooseIcon}>
          {if @state.newIconDataURL
            <img src={@state.newIconDataURL} style={maxHeight: '3em', maxWidth: '3em'} />
          else if @props.icon and @state.newIconFile isnt @constructor.SHOULD_REMOVE_ICON
            <img src={@props.icon} style={maxHeight: '3em', maxWidth: '3em'} />
          else
            <small className="standard-button">No icon chosen</small>}
        </FileButton>{' '}

        <small>
          {if @state.newIconFile?
            <button type="button" className="minor-button" onClick={@resetIcon}>Reset</button>
          else if @props.icon
            <button type="button" className="minor-button" onClick={@removeIcon}>Clear</button>}
        </small>
      </p>

      <p>
        <label>
          Title<br />
          <input type="text" ref="titleInput" className="standard-input full" defaultValue={@props.title} disabled={@props.working} autoFocus />
        </label>
      </p>

      Content
      <br />
      <MarkdownEditor ref="contentInput" value={@state.content} disabled={@props.working} rows="10" cols="100" onChange={@handleContentChange} />
      <br />

      <p>
        <label>
          <button type="button" className="minor-button" disabled={@props.working} onClick={@cancel}>Cancel</button>
        </label>{' '}

        <label>
          <button type="button" className="major-button" disabled={@props.working} onClick={@save}>Done</button>
        </label>{' '}

        {if @props.working
          <strong>· · ·</strong>}
      </p>
    </div>

  handleContentChange: (e) ->
    @setState content: e.target.value

module.exports = ArticleEditor
