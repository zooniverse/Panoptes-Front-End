React = require 'react'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
ImageSelector = require '../../components/image-selector'
apiClient = require 'panoptes-client/lib/api-client'
putFile = require '../../lib/put-file'
TagSearch = require '../../components/tag-search'
{MarkdownEditor} = require 'markdownz'
MarkdownHelp = require '../../partials/markdown-help'
alert = require('../../lib/alert')
{DISCIPLINES} = require '../../components/disciplines'
Select = require 'react-select'
`import CharLimit from '../../components/char-limit';`
`import ExternalLinksEditor from './external-links-editor';`
`import DisplayNameSlugEditor from '../../partials/display-name-slug-editor';`

MAX_AVATAR_SIZE = 64000
MAX_BACKGROUND_SIZE = 256000

module.exports = React.createClass
  displayName: 'EditProjectDetails'

  getDefaultProps: ->
    project: {}

  getInitialState: ->
    {disciplineTagList, otherTagList} = @splitTags()
    avatarError: null
    backgroundError: null
    disciplineTagList: disciplineTagList
    otherTagList: otherTagList

  splitTags: (kind) ->
    disciplineTagList = []
    otherTagList = []
    for t in @props.project.tags
      if DISCIPLINES.some((el) -> el.value == t)
        disciplineTagList.push(t)
      else
        otherTagList.push(t)
    {disciplineTagList, otherTagList}

  render: ->
    # Failures on media GETs are acceptable here,
    # but the JSON-API lib doesn't cache failed requests,
    # so do it manually:

    @avatarGet ?= @props.project.get 'avatar'
      .catch ->
        null

    @backgroundGet ?= @props.project.get 'background'
      .catch ->
        null

    <div>
      <p className="form-help">Input the basic information about your project, and set up its home page.</p>
      <div className="columns-container">
        <div>
          Avatar<br />
          <PromiseRenderer promise={@avatarGet} then={(avatar) =>
            placeholder = <div className="form-help content-container">Drop an avatar image here</div>
            <ImageSelector maxSize={MAX_AVATAR_SIZE} ratio={1} src={avatar?.src} placeholder={placeholder} onChange={@handleMediaChange.bind this, 'avatar'} />
          } />
          {if @state.avatarError
            <div className="form-help error">{@state.avatarError.toString()}</div>}

          <p><small className="form-help">Pick a logo to represent your project. To add an image, either drag and drop or click to open your file viewer. For best results, use a square image of not more than 50 KB.</small></p>

          <hr />

          Background image<br />
          <PromiseRenderer promise={@backgroundGet} then={(background) =>
            placeholder = <div className="form-help content-container">Drop a background image here</div>
            <ImageSelector maxSize={MAX_BACKGROUND_SIZE} src={background?.src} placeholder={placeholder} onChange={@handleMediaChange.bind this, 'background'} />
          } />
          {if @state.backgroundError
            <div className="form-help error">{@state.backgroundError.toString()}</div>}

          <p><small className="form-help">This image will be the background for all of your project pages, including your project’s front page. To add an image, either drag and drop or left click to open your file viewer. For best results, use good quality images no more than 256 KB.</small></p>

          <hr />

          <p>
            <AutoSave tag="label" resource={@props.project}>
              {checked = @props.project.configuration?.user_chooses_workflow}
              <input type="checkbox" name="configuration.user_chooses_workflow" defaultChecked={checked} defaultValue={checked} onChange={handleInputChange.bind @props.project} />{' '}
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
            <small className="form-help">This should be a one-line call to action for your project that displays on your landing page. Some volunteers will decide whether to try your project based on reading this, so try to write short text that will make people actively want to join your project. <CharLimit limit={300} string={@props.project.description ? ''} /></small>
          </p>

          <div>
            <AutoSave resource={@props.project}>
              <span className="form-label">Introduction</span>
              <br />
              <MarkdownEditor className="full" name="introduction" rows="10" value={@props.project.introduction} project={@props.project} onChange={handleInputChange.bind @props.project} onHelp={-> alert <MarkdownHelp/>}/>
            </AutoSave>
            <small className="form-help">Add a brief introduction to get people interested in your project. This will display on your landing page. <CharLimit limit={1500} string={@props.project.introduction ? ''} /></small>
          </div>

          <p>
            <AutoSave resource={@props.project}>
              <span className="form-label">Workflow Description</span>
              <br />
              <textarea className="standard-input full" name="workflow_description" value={@props.project.workflow_description} onChange={handleInputChange.bind @props.project} />
            </AutoSave>
            <small className="form-help">Add text here when you have multiple workflows and want to help your volunteers decide which one they should do. <CharLimit limit={500} string={@props.project.workflow_description ? ''} /></small>
          </p>

          <p>
            <AutoSave resource={@props.project}>
              <span className="form-label">Announcement Banner</span>
              <br />
              <MarkdownEditor className="full" name="configuration.announcement" rows="2" value={@props.project.configuration?.announcement} project={@props.project} onChange={handleInputChange.bind @props.project} onHelp={-> alert <MarkdownHelp/>}/>
            </AutoSave>
            <small className="form-help">This text will appear as a banner at the top of all your project's pages. Only use this when you've got a big important announcement to make!</small>
          </p>

          <div>
            <AutoSave resource={@props.project}>
            <span className="form-label">Discipline Tag</span>
            <br />
            <Select
              ref="disciplineSelect"
              name="disciplines"
              placeholder="Add Discipline Tag"
              className="discipline-tag"
              value={@state.disciplineTagList}
              options={DISCIPLINES}
              multi={true}
              onChange={@handleDisciplineTagChange} />
              <small className="form-help">Enter or select one or more discipline tags to identify which field(s) of research your project belongs to. These tags will determine the categories your project will appear under on the main Zooniverse projects page, if your project becomes a full Zooniverse project. </small>
              <br />
              </AutoSave>
              <AutoSave resource={@props.project}>
              <span className="form-label">Other Tags</span>
              <br />
              <TagSearch name="tags" multi={true} value={@state.otherTagList} onChange={@handleOtherTagChange} />
            </AutoSave>
            <small className="form-help">Enter a list of additional tags to describe your project separated by commas to help users find your project.</small>
          </div>

          <div>
            External links<br />
            <small className="form-help">Adding an external link will make it appear as a new tab alongside the about, classify, talk, and collect tabs. You can rearrange the displayed order by clicking and dragging on the left gray tab next to each link below.</small>
            <ExternalLinksEditor project={@props.project} />
          </div>
        </div>
      </div>
    </div>

  handleDisciplineTagChange: (options) ->
    newTags = options.map (option) ->
      option.value
    @setState disciplineTagList: newTags
    allTags = newTags.concat @state.otherTagList
    @handleTagChange(allTags)

  handleOtherTagChange: (options) ->
    newTags = options.map (option) ->
      option.value
    @setState otherTagList: newTags
    allTags = @state.disciplineTagList.concat newTags
    @handleTagChange(allTags)

  handleTagChange: (value) ->
    event =
      target:
        value: value
        name: 'tags'
        dataset: {}
    handleInputChange.call @props.project, event

  handleMediaChange: (type, file) ->
    errorProp = "#{type}Error"

    newState = {}
    newState[errorProp] = null
    @setState newState

    apiClient.post @props.project._getURL(type), media: content_type: file.type
      .then ([resource]) =>
        putFile resource.src, file, {'Content-Type': file.type}
      .then =>
        @props.project.uncacheLink type
        @["#{type}Get"] = null # Uncache the local request so that rerendering makes it again.
        @props.project.refresh() # Update the resource's links.
      .then =>
        @props.project.emit 'change' # Re-render
      .catch (error) =>
        newState = {}
        newState[errorProp] = error
        @setState newState
