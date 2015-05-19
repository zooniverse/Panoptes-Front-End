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

    <div>
      <p className="form-help">Input the basic information about your project, and set up its home page.</p>
      <div className="columns-container">
        <div>
          Avatar<br />
          <PromiseRenderer promise={@avatarSrcGet} then={(avatarSrc) =>
            placeholder = <div className="form-help content-container">Drop an avatar image here</div>
            <ImageSelector maxSize={MAX_AVATAR_SIZE} ratio={1} defaultValue={avatarSrc} placeholder={placeholder} onChange={@handleMediaChange.bind this, 'avatar'} />
          } />
          {if @state.avatarError
            <div className="form-help error">{@state.avatarError.toString()}</div>}

          <small className="form-help">Pick an avatar for your project. This will represent your project on the Zooniverse home page. It can also be used as your project’s brand. It’s best if it’s recognizable even as a small icon. To add an image, either drag and drop or right click to open your file viewer. For best results, use a square image no larger than 50 KB.</small>

          <hr />

          Background image<br />
          <PromiseRenderer promise={@backgroundSrcGet} then={(backgroundSrc) =>
            placeholder = <div className="form-help content-container">Drop a background image here</div>
            <ImageSelector maxSize={MAX_BACKGROUND_SIZE} defaultValue={backgroundSrc} placeholder={placeholder} onChange={@handleMediaChange.bind this, 'background'} />
          } />
          {if @state.backgroundError
            <div className="form-help error">{@state.backgroundError.toString()}</div>}

          <small className="form-help">This image will be the background for all of your project pages, including your project’s front page, which newcomers will see first. It should be relatively high resolution and you should be able to read text written across it. To add an image, either drag and drop or right click to open your file viewer. For best results, use photographic images of at least one megapixel, no larger than 256 KB.</small>

          <hr />

          <p>
            <label>
              <input type="checkbox" name="configuration.user_chooses_workflow" checked={@props.project.configuration?.user_chooses_workflow} onChange={@handleChange} />
              Volunteers can choose which workflow they work on
            </label><br />
            <small className="form-help">A workflow is a set of tasks a volunteer completes to create a classification. Your project might have multiple workflows (if you want to set different tasks for different image sets). Check this to let volunteers select which workflow they want to to work on; otherwise, they’ll be served randomly (which is the default).</small>
          </p>

          <p>
            <label>
              <input type="checkbox" name="private" checked={@props.project.private} onChange={@handleChange} />
              Private project<br />
              <small className="form-help">On “private” projects, only users with specified project roles can see or classify on the project. We *strongly* recommend you keep your project private while you’re still working out its details. Share it with your team to get feedback by adding them in the Collaborators area (linked at the left). Team members you add can see your project even if it’s private. Once your project is public, anyone with the link can view and classify in it.</small>
            </label>
          </p>
        </div>

        <div className="column">
          <p>
            Name<br />
            <input type="text" className="standard-input full" name="display_name" value={@props.project.display_name} disabled={@state.saveInProgress} onChange={@handleChange} />
            <small className="form-help">The project name is the first thing people will see about the project, and it will show up in the project URL. Try to keep it short and sweet.<br />
            Please note that your project name shouldn’t have any punctuation, as this causes issues with the url.</small>
          </p>

          <p>
            Description<br />
            <textarea className="standard-input full" name="description" value={@props.project.description} row="2" disabled={@state.saveInProgress} onChange={@handleChange} />
            <small className="form-help">This should be a one-line call to action for your project. This will display on your landing page and, if approved, on the Zooniverse home page. Some volunteers will decide whether to try your project based on reading this, so try to write short text that will make people actively want to join your project.</small>
          </p>

          <p>
            Introduction<br />
            <textarea className="standard-input full" name="introduction" value={@props.project.introduction} rows="10" disabled={@state.saveInProgress} onChange={@handleChange} />
            <small className="form-help">Add a brief introduction to get people interested in your project. This will display on your landing page. Note this field renders markdown (<insert link to best markdown tutorial>), so you can put formatting in it. You can make this longer than the Description, but it’s still probably best to save much longer text for areas like the Science Case or FAQ tabs.</small>
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
