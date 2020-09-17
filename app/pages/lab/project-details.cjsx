React = require 'react'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
AutoSave = require '../../components/auto-save'
handleInputChange = require('../../lib/handle-input-change').default
ImageSelector = require '../../components/image-selector'
apiClient = require 'panoptes-client/lib/api-client'
putFile = require '../../lib/put-file'
TagSearch = require '../../components/tag-search'
{MarkdownEditor, MarkdownHelp} = require 'markdownz'
alert = require('../../lib/alert').default
Select = require('react-select').default
getAllLinked = require('../../lib/get-all-linked').default
`import DISCIPLINES from '../../constants/disciplines';`
`import CharLimit from '../../components/char-limit';`
`import ExternalLinksEditor from './external-links-editor';`
`import SocialLinksEditor from './social-links-editor';`
`import DisplayNameSlugEditor from '../../partials/display-name-slug-editor';`
`import sanitizeArrayInput from '../../lib/sanitize-array-input';`

MAX_AVATAR_SIZE = 64000
MAX_BACKGROUND_SIZE = 256000

DISCIPLINE_NAMES = (discipline.value for discipline in DISCIPLINES)

module.exports = createReactClass
  displayName: 'EditProjectDetails'

  getDefaultProps: ->
    project: {}

  getInitialState: ->
    {disciplineTagList, otherTagList} = @splitTags()
    disciplineTagList: disciplineTagList
    otherTagList: otherTagList
    researchers: []
    avatar: null
    background: null
    organization: null
    error: null

  componentWillMount: ->
    getAllLinked(@props.project, 'project_roles').then (roles) =>
      scientists = for role in roles when 'scientist' in role.roles or 'owner' in role.roles
        role.links.owner.id
      apiClient.type('users').get(scientists).then (researchers) =>
        @setState({ researchers })

    if @props.project.links?.organization
      @props.project.get('organization')
        .then (organization) =>
          @setState({ organization })
        .catch (error) =>
          console.error error

    @updateImage 'avatar'
    @updateImage 'background'

  updateImage: (type) ->
    @props.project.get(type)
      .then (image) =>
        @setState
          "#{type}": image
      .catch (error) =>
        console.log error

  splitTags: (kind) ->
    disciplineTagList = []
    otherTagList = []
    for tag in @props.project.tags
      if tag in DISCIPLINE_NAMES
        disciplineTagList.push tag
      else
        otherTagList.push tag
    {disciplineTagList, otherTagList}

  researcherOptions: ->
    options = []
    for researcher in @state.researchers
      options.push Object.assign value: researcher.id, label: researcher.display_name
    options.push Object.assign value: @props.project.display_name, label: "#{@props.project.display_name} Avatar"
    options

  render: ->
    # Failures on media GETs are acceptable here,
    # but the JSON-API lib doesn't cache failed requests,
    # so do it manually:
    avatarPlaceholder = <div className="form-help content-container">Drop an avatar image here</div>
    backgroundPlaceholder = <div className="form-help content-container">Drop a background image here</div>

    <div>
      <p className="form-help">Input the basic information about your project, and set up its home page.</p>
      <div className="columns-container">
        <div>
          Avatar<br />
          <ImageSelector maxSize={MAX_AVATAR_SIZE} ratio={1} src={@state.avatar?.src} placeholder={avatarPlaceholder} onChange={@handleMediaChange.bind this, 'avatar'} />
          {if @state.error
            <div className="form-help error">{@state.error.toString()}</div>}

          <p><small className="form-help">Pick a logo to represent your project. To add an image, either drag and drop or click to open your file viewer. For best results, use a square image of not more than 50 KB.</small></p>

          <hr />

          Background image<br />
          <ImageSelector maxSize={MAX_BACKGROUND_SIZE} src={@state.background?.src} placeholder={backgroundPlaceholder} onChange={@handleMediaChange.bind this, 'background'} />
          {if @state.error
            <div className="form-help error">{@state.error.toString()}</div>}

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
          {if @props.project.links?.organization
            <div>
              {if @state.organization
                <p>This project is part of the <Link to={"/organizations/#{@state.organization.slug}"}>{@state.organization.display_name}</Link> organization.</p>
              else
                <p>This project is linked to <strong>Organization #{@props.project.links.organization}</strong>.</p>}
              <p>If you are not a collaborator on the organization, please coordinate with this project's other collaborators for additional information regarding the affiliated organization.</p>
            </div>}

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

          <div>
            <AutoSave resource={@props.project}>
              <span className="form-label">Researcher Quote</span>
              <br />
              <Select
                className="researcher-quote"
                placeholder="Choose a Researcher"
                onChange={@handleResearcherChange}
                options={@researcherOptions()}
                value={@props.project?.configuration?.researcherID} />
              <textarea className="standard-input full" name="researcher_quote" value={@props.project.researcher_quote} onChange={handleInputChange.bind @props.project} />
            </AutoSave>
            <small className="form-help">This text will appear on a project landing page alongside an avatar of the selected researcher. <CharLimit limit={255} string={@props.project.researcher_quote ? ''} /></small>
          </div>

          <div>
            <AutoSave resource={@props.project}>
              <span className="form-label">Announcement Banner</span>
              <br />
              <MarkdownEditor className="full" name="configuration.announcement" rows="2" value={@props.project.configuration?.announcement} project={@props.project} onChange={handleInputChange.bind @props.project} onHelp={-> alert <MarkdownHelp/>}/>
            </AutoSave>
            <small className="form-help">This text will appear as a banner at the top of all your project's pages. Only use this when you've got a big important announcement to make!</small>
          </div>

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
                onChange={@handleDisciplineTagChange}
              />
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
            <small className="form-help">
              Adding an external link will make it appear as a new tab alongside
              the about, classify, talk, and collect tabs. You can rearrange the
              displayed order by clicking and dragging on the left gray tab next
              to each link below.
            </small>
            <br />
            <small className="form-help">
              The URL must begin with "<code>https://</code>" or "<code>http://</code>".
            </small>
            <ExternalLinksEditor project={@props.project} />
            <div className="edit-social-links">
              <h5>Social Links Section</h5>
              <small className="form-help">
                Adding a social link will append a media icon at
                the end of your project menu bar. You can rearrange the
                displayed order by clicking and dragging on the left gray
                tab next to each link below.
              </small>
              <SocialLinksEditor project={@props.project} />
            </div>
          </div>
        </div>
      </div>
    </div>

  handleDisciplineTagChange: (options) ->
    newTags = options.map (option) ->
      option.value
    sanitizedTags = sanitizeArrayInput(newTags)
    @setState disciplineTagList: sanitizedTags
    allTags = sanitizedTags.concat @state.otherTagList
    @handleTagChange(allTags)

  handleResearcherChange: (option) ->
    @props.project.update({
      'configuration.researcherID': option?.value || ""
    })
    @props.project.save()

  handleOtherTagChange: (options) ->
    newTags = options.map (option) ->
      option.value
    sanitizedTags = sanitizeArrayInput(newTags)
    @setState otherTagList: sanitizedTags
    allTags = @state.disciplineTagList.concat sanitizedTags
    @handleTagChange(allTags)

  handleTagChange: (value) ->  
    changes = 
      tags: value
    @props.project.update(changes)

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
        @updateImage type
      .catch (error) =>
        newState = {}
        newState[errorProp] = error
        @setState newState
