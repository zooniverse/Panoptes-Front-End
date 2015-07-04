React = require 'react'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
ImageSelector = require '../../components/image-selector'
apiClient = require '../../api/client'
putFile = require '../../lib/put-file'
counterpart = require 'counterpart'
DataExportButton = require '../../partials/data-export-button'
DisplayNameSlugEditor = require '../../partials/display-name-slug-editor'

MAX_AVATAR_SIZE = 64000
MAX_BACKGROUND_SIZE = 256000

counterpart.registerTranslations 'en',
  projectDetails:
    classificationExport: "Request new classification export"
    subjectExport: "Request new subject export"

ExternalLinksEditor = React.createClass
  displayName: 'ExternalLinksEditor'

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
            <AutoSave key={link._key} tag="tr" resource={@props.project}>
              <td>
                <input type="text" name="urls.#{i}.label" value={@props.project.urls[i].label} onChange={handleInputChange.bind @props.project} />
              </td>
              <td>
                <input type="text" name="urls.#{i}.url" value={@props.project.urls[i].url} onChange={handleInputChange.bind @props.project} />
              </td>
              <td>
                <AutoSave resource={@props.project}>
                  <button type="button" onClick={@handleRemoveLink.bind this, link}>
                    <i className="fa fa-remove"></i>
                  </button>
                </AutoSave>
              </td>
            </AutoSave>}
        </tbody>
      </table>

      <AutoSave resource={@props.project}>
        <button type="button" onClick={@handleAddLink}>Add a link</button>
      </AutoSave>
    </div>

  handleAddLink: ->
    changes = {}
    changes["urls.#{@props.project.urls.length}"] =
      label: 'Example'
      url: 'https://example.com/'
    @props.project.update changes

  handleRemoveLink: (linkToRemove) ->
    changes =
      urls: (link for link in @props.project.urls when link isnt linkToRemove)
    @props.project.update changes

module.exports = React.createClass
  displayName: 'EditProjectDetails'

  getDefaultProps: ->
    project: {}

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

          <p><small className="form-help">Pick a logo to represent your project. To add an image, either drag and drop or click to open your file viewer. For best results, use a square image of not more than 50 KB.</small></p>

          <hr />

          Background image<br />
          <PromiseRenderer promise={@backgroundSrcGet} then={(backgroundSrc) =>
            placeholder = <div className="form-help content-container">Drop a background image here</div>
            <ImageSelector maxSize={MAX_BACKGROUND_SIZE} defaultValue={backgroundSrc} placeholder={placeholder} onChange={@handleMediaChange.bind this, 'background'} />
          } />
          {if @state.backgroundError
            <div className="form-help error">{@state.backgroundError.toString()}</div>}

          <p><small className="form-help">This image will be the background for all of your project pages, including your project’s front page. To add an image, either drag and drop or right click to open your file viewer. For best results, use good quality images no more than 256 KB.</small></p>

          <hr />

          <p>
            <AutoSave tag="label" resource={@props.project}>
              <input type="checkbox" name="configuration.user_chooses_workflow" value={@props.project.configuration?.user_chooses_workflow} onChange={handleInputChange.bind @props.project} />{' '}
              Volunteers can choose which workflow they work on
            </AutoSave>
            <br />
            <small className="form-help">If you have multiple workflows, check this to let volunteers select which workflow they want to to work on; otherwise, they’ll be served randomly.</small>
          </p>
        </div>

        <div className="column">
          <DisplayNameSlugEditor resource={@props.project} resourceType="project" />

          <p>
            <AutoSave resource={@props.project}>
              <span className="form-label">Description</span>
              <br />
              <input className="standard-input full" name="description" value={@props.project.description} onChange={handleInputChange.bind @props.project} />
            </AutoSave>
            <small className="form-help">This should be a one-line call to action for your project that displays on your landing page. Some volunteers will decide whether to try your project based on reading this, so try to write short text that will make people actively want to join your project.</small>
          </p>

          <p>
            <AutoSave resource={@props.project}>
              <span className="form-label">Introduction</span>
              <br />
              <textarea className="standard-input full" name="introduction" rows="10" value={@props.project.introduction} onChange={handleInputChange.bind @props.project} />
            </AutoSave>
            <small className="form-help">Add a brief introduction to get people interested in your project. This will display on your landing page. Note this field renders markdown (<a href="http://markdownlivepreview.com/" target="_blank">learn more about markdown</a>), so you can add formatting.</small>
          </p>

          <p>
            <AutoSave resource={@props.project}>
              <span className="form-label">Workflow Description</span>
              <br />
              <textarea className="standard-input full" name="workflow_description" value={@props.project.workflow_description} onChange={handleInputChange.bind @props.project} />
            </AutoSave>
            <small className="form-help">Add text here when you have multiple workflows and want to help your volunteers decide which one they should do.</small>
          </p>

          <div>
            External links<br />
            <small className="form-help">Adding an external link will make it appear as a new tab alongside the science, classify, and talk tabs.</small>
            <ExternalLinksEditor project={@props.project} />
          </div>

          <hr />

          Data export<br />
          <DataExportButton
            project={@props.project}
            buttonKey="projectDetails.classificationExport"
            exportType="classifications_export"  />
          <DataExportButton
            project={@props.project}
            buttonKey="projectDetails.subjectExport"
            exportType="subjects_export"  />
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
