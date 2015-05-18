React = require 'react'
BoundResourceMixin = require '../../lib/bound-resource-mixin'
PromiseRenderer = require '../../components/promise-renderer'
ImageSelector = require '../../components/image-selector'
apiClient = require '../../api/client'
putFile = require '../../lib/put-file'

MAX_AVATAR_SIZE = 64000
MAX_BACKGROUND_SIZE = 256000

ExternalLinksEditor = React.createClass
  displayName: 'ExternalLinksEditor'

  mixins: [BoundResourceMixin]

  boundResource: 'project'

  getDefaultProps: ->
    project: {}

  render: ->
    <div>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {for link, i in @props.project.urls
            link._key ?= Math.random()
            <tr key={link._key}>
              <td><input type="text" name="urls.#{i}.label" value={link.label} onChange={@handleChange}/></td>
              <td><input type="text" name="urls.#{i}.url" value={link.url} onChange={@handleChange}/></td>
              <td><button type="button" onClick={@handleRemoveLink.bind this, link._key}><i className="fa fa-remove"></i></button></td>
            </tr>}
        </tbody>
      </table>

      <button type="button" onClick={@handleAddLink}>Add a link</button>
    </div>

  handleAddLink: ->
    changes = {}
    changes["urls.#{@props.project.urls.length}"] =
      label: 'Example'
      url: 'https://example.com/'
    @props.project.update changes

  handleRemoveLink: (linkKey) ->
    changes = {}
    changes['urls'] = @props.project.urls.filter((link) -> link._key != linkKey)
    @props.project.update changes

module.exports = React.createClass
  displayName: 'EditProjectDetails'

  mixins: [BoundResourceMixin]

  boundResource: 'project'

  getDefaultProps: ->
    project: null

  getInitialState: ->
    avatarError: null
    backgroundError: null

  render: ->
    # Failures on media GETs are acceptable here,
    # but the JSON-API lib doesn't cache failed requests,
    # so do it manually:

    @avatarSrcGet ?= @props.project.get 'avatar'
      .then (avatar) ->
        avatar.src
      .catch ->
        ''

    @backgroundSrcGet ?= @props.project.get 'background'
      .then (background) ->
        background.src
      .catch ->
        ''

    <div className="columns-container">
      <div>
        Avatar<br />
        <PromiseRenderer promise={@avatarSrcGet} then={(avatarSrc) =>
          placeholder = <div className="form-help content-container">Drop an avatar image here</div>
          <ImageSelector maxSize={MAX_AVATAR_SIZE} ratio={1} defaultValue={avatarSrc} placeholder={placeholder} onChange={@handleMediaChange.bind this, 'avatar'} />
        } />
        {if @state.avatarError
          <div className="form-help error">{@state.avatarError.toString()}</div>}

        <br />

        Background image<br />
        <PromiseRenderer promise={@backgroundSrcGet} then={(backgroundSrc) =>
          placeholder = <div className="form-help content-container">Drop a background image here</div>
          <ImageSelector maxSize={MAX_BACKGROUND_SIZE} defaultValue={backgroundSrc} placeholder={placeholder} onChange={@handleMediaChange.bind this, 'background'} />
        } />
        {if @state.backgroundError
          <div className="form-help error">{@state.backgroundError.toString()}</div>}

        <br />

        <p>
          <label>
            <input type="checkbox" name="configuration.user_chooses_workflow" checked={@props.project.configuration?.user_chooses_workflow} onChange={@handleChange} />
            Volunteers can choose which workflow they work on
          </label>
        </p>

        <p>
          <label>
            <input type="checkbox" name="private" checked={@props.project.private} onChange={@handleChange} />
            Private project <small className="form-help">TODO: Explain</small>
          </label>
        </p>
      </div>

      <div className="column">
        {if @props.project.configuration?.redirect
          <p className="form-help warning"><strong>Note: users who follow a link to this project will be redirected to <a href={@props.project.configuration.redirect}>{@props.project.configuration.redirect}</a>.</strong> Contact the Zooniverse to change this.</p>}
        <p>
          Name<br />
          <input type="text" className="standard-input full" name="display_name" value={@props.project.display_name} disabled={@state.saveInProgress} onChange={@handleChange} />
        </p>

        <p>
          Description<br />
          <textarea className="standard-input full" name="description" value={@props.project.description} row="2" disabled={@state.saveInProgress} onChange={@handleChange} />
        </p>

        <p>
          Introduction<br />
          <textarea className="standard-input full" name="introduction" value={@props.project.introduction} rows="10" disabled={@state.saveInProgress} onChange={@handleChange} />
        </p>

        <div>
          External links<br />
          <ExternalLinksEditor project={@props.project} />
        </div>

        <p>
          <button type="button" className="major-button" disabled={@state.saveInProgress or not @props.project.hasUnsavedChanges()} onClick={@saveResource}>Save</button>{' '}
          {@renderSaveStatus()}
        </p>
      </div>
    </div>

  handleMediaChange: (type, file) ->
    errorProp = "#{type}Error"

    newState = {}
    newState[errorProp] = null
    @setState newState

    apiClient.post @props.project._getURL(type), media: content_type: file.type
      .then ([resource]) =>
        putFile resource.src, file
      .then =>
        @props.project.uncacheLink type
        @["#{type}SrcGet"] = null # Uncache the local request so that rerendering makes it again.
        @props.project.emit 'change'
      .catch (error) =>
        newState = {}
        newState[errorProp] = error
        @setState newState
