React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
ImageSelector = require '../../components/image-selector'
apiClient = require 'panoptes-client/lib/api-client'
putFile = require '../../lib/put-file'

MAX_AVATAR_SIZE = 65536
MAX_HEADER_SIZE = 256000

module.exports = React.createClass
  displayName: 'CustomizeProfilePage'

  getDefaultProps: ->
    user: null

  getInitialState: ->
    avatarError: null
    headerError: null

  render: ->
    @avatarGet ?= @props.user.get 'avatar', {}
      .then ([avatar]) ->
        avatar
      .catch ->
        null
    @profile_headerGet ?= @props.user.get 'profile_header', {}
      .then ([header]) ->
        header
      .catch ->
        null

    <div>
      <div className="content-container">
        <h3>Change avatar</h3>
        <PromiseRenderer promise={@avatarGet}>{(avatar) =>
          placeholder = <p className="content-container">Drop an image here (or click to select).</p>
          <div>
            <p className="form-help">Drop an image here (square, less than {Math.floor MAX_AVATAR_SIZE / 1000} KB)</p>
            <div style={width: '20vw'}>
              <ImageSelector maxSize={MAX_AVATAR_SIZE} ratio={1} src={avatar?.src} placeholder={placeholder} onChange={@handleMediaChange.bind(this, 'avatar')} />
            </div>
            <div>
              <button type="button" disabled={avatar is null} onClick={@handleMediaClear.bind(this, 'avatar')}>Clear avatar</button>
            </div>
          </div>
        }</PromiseRenderer>
        {if @state.avatarError
          <div className="form-help error">{@state.avatarError.toString()}</div>}
      </div>
      <hr />
      <div className="content-container">
        <h3>Change profile header</h3>
        <PromiseRenderer promise={@profile_headerGet}>{(header) =>
          placeholder = <p className="content-container">Drop an image here (or click to select).</p>
          <div>
            <p className="form-help">Drop an image here (any dimensions, less than {Math.floor MAX_HEADER_SIZE / 1000} KB)</p>
            <div style={width: '40vw'}>
              <ImageSelector maxSize={MAX_HEADER_SIZE} src={header?.src} placeholder={placeholder} onChange={@handleMediaChange.bind(this, 'profile_header')} />
            </div>
            <div>
              <button type="button" disabled={header is null} onClick={@handleMediaClear.bind(this, 'profile_header')}>Clear header</button>
            </div>
          </div>
        }</PromiseRenderer>
        {if @state.headerError
          <div className="form-help error">{@state.headerError.toString()}</div>}
      </div>
    </div>

  handleMediaChange: (type, file) ->
    errorProp = "#{type}Error"

    newState = {}
    newState[errorProp] = null
    @setState newState

    apiClient.post @props.user._getURL(type), media: content_type: file.type
      .then ([resource]) =>
        putFile resource.src, file, {'Content-Type': file.type}
      .then =>
        @["#{type}Get"] = null # Uncache the local request so that rerendering makes it again.
        @forceUpdate()
      .catch (error) =>
        newState = {}
        newState[errorProp] = error
        @setState newState

  handleMediaClear: (type) ->
    errorProp = "#{type}Error"

    newState = {}
    newState[errorProp] = null
    @setState newState

    @["#{type}Get"]
      .then (resource) =>
        resource?.delete()
      .then =>
        @["#{type}Get"] = null
        @forceUpdate()
      .catch (error) =>
        newState = {}
        newState[errorProp] = error
        @setState newState
