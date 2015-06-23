React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
ImageSelector = require '../../components/image-selector'
apiClient = require '../../api/client'
putFile = require '../../lib/put-file'

MAX_AVATAR_SIZE = 65536
MAX_HEADER_SIZE = 256000

module.exports = React.createClass
  displayName: 'CustomizeProfilePage'

  getInitialState: ->
    avatarError: null
    headerError: null

  render: ->
    @getAvatarSrc ?= @props.user.get 'avatar'
      .then (avatar) ->
        avatar.src
      .catch ->
        ''

    @getHeaderSrc ?= @props.user.get 'profile_header'
      .then (header) ->
        header.src
      .catch ->
        ''

    console.log("HERE")
    <div className="customize-profile-tab columns-container">
      <div className="content-container profile-avatar-selector">
        <p>Change avatar</p>
        <PromiseRenderer promise={@getAvatarSrc}>{(avatarSrc) =>
          placeholder = <div className="form-help content-container">Drop an image here</div>
          <ImageSelector maxSize={MAX_AVATAR_SIZE} ratio={1} defaultValue={avatarSrc} placeholder={placeholder} onChange={@handleMediaChange.bind(this, 'avatar')} />
        }</PromiseRenderer>
        {if @state.avatarError
          <div className="form-help error">{@state.avatarError.toString()}</div>}
      </div>

      <div className="content-container profile-header-selector">
        <p>Change profile header</p>
        <PromiseRenderer promise={@getHeaderSrc}>{(headerSrc) =>
          placeholder = <div className="form-help content-container">Drop an image here</div>
          <ImageSelector maxSize={MAX_HEADER_SIZE} defaultValue={headerSrc} placeholder={placeholder} onChange={@handleMediaChange.bind(this, 'header')} />
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
        putFile resource.src, file
      .then =>
        @props.user.uncacheLink type
        @["#{type}SrcGet"] = null # Uncache the local request so that rerendering makes it again.
        @props.user.emit 'change'
      .catch (error) =>
        newState = {}
        newState[errorProp] = error
        @setState newState
