React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
ImageSelector = require '../../components/image-selector'
apiClient = require '../../api/client'
putFile = require '../../lib/put-file'

MAX_MEDIA_COUNT = 30
MAX_MEDIA_SIZE = 500000

# For use on click.
selectTarget = (e) =>
  e.target.select()

MediaItem = React.createClass
  displayName: 'MediaItem'

  getDefaultProps: ->
    medium: {}
    onDelete: Function.prototype

  getInitialState: ->
    width: NaN
    height: NaN
    loading: true
    loadError: null
    deleting: false
    deleteError: null

  render: ->
    <span className="media-item">
      <span className="media-item-container">
        <button type="button" className="media-item-delete-button" disabled={@state.loading or @state.deleting} onClick={@handleDelete}>&times;</button>
        {if @props.medium.content_type.indexOf 'image/' is 0
          <img ref="img" className="media-item-image" src={@props.medium.src} onLoad={@handleLoad} onError={@handleLoadError} />}
      </span>
      <br />
      {@props.medium.metadata?.filename ? <i>Untitled</i>}
      <br />
      {if @state.loading
        <span>Loading...</span>
      if @state.loadError
        <span>{@state.loadError.toString()}</span>
      else if @state.deleting
        <span>Deleting...</span>
      else if @state.deleteError
        <span>{@state.deleteError.toString()}</span>
      else unless isNaN(@state.width) or isNaN(@state.height)
        <small>{@state.width}&times;{@state.height}</small>}
      <br />
      <textarea className="media-item-src" defaultValue="![#{@props.medium.metadata?.filename}](#{@props.medium.src})" readOnly onClick={selectTarget} />
    </span>

  handleLoad: ->
    media = @refs.img.getDOMNode()
    @setState
      loading: false
      width: media.naturalWidth
      height: media.naturalHeight

  handleLoadError: ->
    @setState
      loading: false
      loadError: 'Failed to load media'

  handleDelete: (e) ->
    confirmed = e.shiftKey or confirm 'Really delete?'
    if confirmed
      @setState
        deleting: true
        deleteError: null

      @props.medium.delete()
        .catch (error) =>
          @setState deleteError: error
        .then =>
          @setState deleting: false
          @props.onDelete()

MediaUploadArea = React.createClass
  displayName: 'MediaUploadArea'

  getDefaultProps: ->
    project: {}
    onUpload: Function.prototype

  getInitialState: ->
    uploading: false
    uploadError: null

  render: ->
    <span className="media-upload-area">
      <ImageSelector placeholder="Drop an image here" onChange={@handleImageSelection} />
      {if @state.uploading
        <span>Working...</span>}
      {if @state.uploadError
        <span>{@state.uploadError.toString()}</span>}
    </span>

  handleImageSelection: (file, img) ->
    @setState
      uploading: true
      uploadError: null

    payload =
      media:
        content_type: file.type
        metadata:
          filename: img.title

    apiClient.post @props.project._getURL('attached_images'), payload
      .then ([media]) =>
        putFile media.src, file
      .catch (error) =>
        @setState uploadError: error
      .then =>
        @setState uploading: false
        @props.onUpload()

module.exports = React.createClass
  displayName: 'EditMediaPage'

  getDefaultProps: ->
    project: {}

  render: ->
    @getMedia ?= apiClient.get @props.project._getURL('attached_images'), page_size: MAX_MEDIA_COUNT

    <div className="edit-media-page">
      <div className="content-container">
        <p><strong>You can add images here to use in your project’s content.</strong> Just copy and paste the image’s Markdown code: <code>![title](url)</code>.</p>
        <PromiseRenderer promise={@getMedia} then={(media) =>
          <div className="media-list">
            {for medium in media
              <MediaItem key={medium.id} medium={medium} onDelete={@handleChange} />}
          </div>
        } catch={=>
          <div>No media</div>
        } />
      </div>

      <hr />

      <div className="content-container">
        <PromiseRenderer promise={@getMedia.catch -> []} then={(media) =>
          if media.length < MAX_MEDIA_COUNT
            <div>
              Add an image<br />
              <MediaUploadArea project={@props.project} onUpload={@handleChange} />
            </div>
          else
            <p>You’ve reached the limit of {MAX_MEDIA_COUNT} images for this project. Delete some images to add new ones.</p>
        } />
      </div>
    </div>

  handleChange: ->
    @getMedia = null
    @forceUpdate()
