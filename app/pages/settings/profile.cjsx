React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
ImageSelector = require '../../components/image-selector'
apiClient = require '../../api/client'
putFile = require '../../lib/put-file'
ClassificationsRibbon = require '../../components/classifications-ribbon'

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
    @avatarGet ?= @props.user.get 'avatar'
      .then ([avatar]) ->
        avatar
      .catch ->
        null

    @headerGet ?= @props.user.get 'profile_header'
      .then ([header]) ->
        header
      .catch ->
        null

    <div>
      <div className="content-container">
        <h3>Classifications ribbon</h3>
        <p><ClassificationsRibbon user={@props.user} /></p>
        <p>
          <label>
            <input type="checkbox" disabled />{' '}
            Display my ribbon publicly <small>(coming soon!)</small>
          </label>
        </p>
        <p className="form-help">Your ribbon shows your classifications per project.</p>
      </div>
      <hr />
      <div className="content-container">
        <h3>Change avatar</h3>
        <PromiseRenderer promise={@avatarGet}>{(avatar) =>
          placeholder = <p className="content-container">Drop an image here (or click to select).</p>
          <div>
            <p className="form-help">Drop an image here (square, less than {Math.floor MAX_AVATAR_SIZE / 1000} KB)</p>
            <div style={width: '20vw'}>
              <ImageSelector maxSize={MAX_AVATAR_SIZE} ratio={1} defaultValue={avatar?.src} placeholder={placeholder} onChange={@handleMediaChange.bind(this, 'avatar')} />
            </div>
          </div>
        }</PromiseRenderer>
        {if @state.avatarError
          <div className="form-help error">{@state.avatarError.toString()}</div>}
      </div>
      <hr />
      <div className="content-container">
        <h3>Change profile header</h3>
        <PromiseRenderer promise={@headerGet}>{(header) =>
          placeholder = <p className="content-container">Drop an image here (or click to select).</p>
          <div>
            <p className="form-help">Drop an image here (any dimensions, less than {Math.floor MAX_HEADER_SIZE / 1000} KB)</p>
            <div style={width: '40vw'}>
              <ImageSelector maxSize={MAX_HEADER_SIZE} defaultValue={header?.src} placeholder={placeholder} onChange={@handleMediaChange.bind(this, 'profile_header')} />
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
        putFile resource.src, file
      .then =>
        @props.user.uncacheLink type
        @["#{type}Get"] = null # Uncache the local request so that rerendering makes it again.
        @props.user.emit 'change'
      .catch (error) =>
        newState = {}
        newState[errorProp] = error
        @setState newState
