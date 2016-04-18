React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
putFile = require '../lib/put-file'
FileButton = require '../components/file-button'
{MarkdownEditor} = require 'markdownz'
debounce = require 'debounce'

ProjectModalStepEditor = React.createClass
  getDefaultProps: ->
    step: null
    media: null

    onChange: ->
      console.log 'ProjectModalStepEditor onChange', arguments

    onMediaSelect: ->
      console.log 'ProjectModalStepEditor onMediaSelect', arguments

    onMediaClear: ->
      console.log 'ProjectModalStepEditor onMediaClear', arguments

    onRemove: ->
      console.log 'ProjectModalStepEditor onRemove', arguments

  render: ->
    <div className="project-modal-step-editor">
      <header>
        <button type="button" className="secret-button" title="Remove step" aria-label="Remove step" onClick={@props.onRemove}>
          <i className="fa fa-times fa-fw"></i>
        </button>
      </header>
      <p>
        {if @props.media?
          <span>
            <img className="project-modal-step-editor-media" src={@props.media.src} />{' '}
            <button type="button" className="minor-button" onClick={@props.onMediaClear}>Clear</button>
          </span>}{' '}
        <FileButton className="standard-button" onSelect={@handleMediaChange}>Select media</FileButton>
      </p>
      <div>
        <MarkdownEditor className="full" value={@props.step.content} onChange={@handleContentChange} />
      </div>
    </div>

  handleMediaChange: (e) ->
    @props.onMediaSelect e.target.files[0], arguments...

  handleContentChange: (e) ->
    @props.onChange 'content', e.target.value, arguments...

ProjectModalEditor = React.createClass
  getDefaultProps: ->
    projectModal: null
    media: null
    kind: null

    onStepAdd: ->
      console.log 'ProjectModalEditor onStepAdd', arguments

    onStepRemove: ->
      console.log 'ProjectModalEditor onStepRemove', arguments

    onMediaSelect: ->
      console.log 'ProjectModalEditor onMediaSelect', arguments

    onStepChange: ->
      console.log 'ProjectModalEditor onChange', arguments

  render: ->
    <div className="project-modal-editor">
      <p className="form-label">{@props.kind} #{@props.projectModal.id}</p>
      {if @props.projectModal.steps.length is 0
        <p>This {@props.kind} has no steps.</p>
      else
        for step, i in @props.projectModal.steps
          step._key ?= Math.random()
          <ProjectModalStepEditor
            key={step._key}
            step={step}
            media={@props.media?[step.media]}
            onMediaSelect={@props.onMediaSelect.bind null, i}
            onMediaClear={@props.onMediaClear.bind null, i}
            onChange={@props.onStepChange.bind null, i}
            onRemove={@props.onStepRemove.bind null, i}
          />}
      <div>
        <button type="button" onClick={@props.onStepAdd}>Add a step</button>
      </div>
    </div>

ProjectModalEditorController = React.createClass
  displayName: 'ProjectModalEditorController'

  getInitialState: ->
    media: {}

  getDefaultProps: ->
    project: null
    projectModal: null
    delayBeforeSave: 5000
    kind: null

    onDelete: ->
      console.log 'ProjectModalEditorController onDelete', arguments

  componentDidMount: ->
    @_boundForceUpdate = @forceUpdate.bind this
    @props.projectModal.listen @_boundForceUpdate
    @fetchMediaFor(@props.projectModal)

  componentWillUnmount: ->
    @props.projectModal.stopListening @_boundForceUpdate

  fetchMediaFor: (projectModal) ->
    if projectModal?
      projectModal.get 'attached_images', {} # Prevent caching.
        .catch =>
          [] # We get an an error if there're no attached images.
        .then (mediaResources) =>
          media = {}
          for mediaResource in mediaResources
            media[mediaResource.id] = mediaResource
          @setState {media}
    else
      @setState media: {}

  render: ->
    <div>
      <hr />
      <ProjectModalEditor
        projectModal={@props.projectModal}
        media={@state.media}
        kind={@props.kind}
        onStepAdd={@handleStepAdd}
        onStepRemove={@handleStepRemove}
        onMediaSelect={@handleStepMediaChange}
        onMediaClear={@handleStepMediaClear}
        onStepChange={@handleStepChange}
      />
    </div>

  handleStepAdd: ->
    @props.projectModal.steps.push
      media: ''
      content: ''
    @props.projectModal.update 'steps'
    @props.projectModal.save()

  handleStepRemove: (index) ->
    @handleStepMediaClear index

    changes = {}
    changes["steps.#{index}"] = undefined
    @props.projectModal.update changes

    if @props.projectModal.steps.length is 0
      @props.projectModal.delete()
        .then =>
          @props.onDelete()
    else
      @props.projectModal.save()

  handleStepMediaChange: (index, file) ->
    @handleStepMediaClear index

    payload =
      media:
        content_type: file.type
        metadata:
          filename: file.name

    apiClient.post @props.projectModal._getURL('attached_images'), payload
      .then (media) =>
        media = [].concat(media)[0]
        putFile media.src, file, {'Content-Type': file.type}
          .then =>
            changes = {}
            changes["steps.#{index}.media"] = media.id
            @props.projectModal.update changes
            @props.projectModal.save()
              .then =>
                @fetchMediaFor @props.projectModal
      .catch (error) =>
        console.error error

  handleStepMediaClear: (index) ->
    @state.media[@props.projectModal.steps[index].media]?.delete()
    changes = {}
    changes["steps.#{index}.media"] = undefined
    @props.projectModal.update changes
    @props.projectModal.save()

  handleStepChange: (index, key, value) ->
    changes = {}
    changes["steps.#{index}.#{key}"] = value
    @props.projectModal.update changes
    @saveProjectModal()

  saveProjectModal: ->
    unless @_debouncedSaveProjectModal?
      boundProjectModalSave = @props.projectModal.save.bind @props.projectModal
      @_debouncedSaveProjectModal = debounce boundProjectModalSave, @props.delayBeforeSave
    @_debouncedSaveProjectModal arguments...

ProjectModalCreator = React.createClass
  getDefaultProps: ->
    project: null
    kind: null

    onCreate: ->
      console.log 'ProjectModalCreator onCreate', arguments

  getInitialState: ->
    error: null

  render: ->
    <div>
      {if @state.error?
          <p>{@state.error.toString()}</p>}
      <p>
        <button type="button" onClick={@handleCreateClick}>Build a {@props.kind}</button>
      </p>
    </div>

  handleCreateClick: ->
    projectModalData =
      steps: []
      language: 'en'
      kind: @props.kind
      links:
        project: @props.project.id

    @setState error: null
    apiClient.type('tutorials').create(projectModalData).save()
      .then (createdProjectModal) =>
        createdProjectModal.addLink 'workflows', @props.project.links.workflows
        @props.onCreate createdProjectModal
      .catch (error) =>
        @setState {error}

ProjectModalEditorFetcher = React.createClass
  getDefaultProps: ->
    project: null
    kind: null

  getInitialState: ->
    loading: false
    error: null
    projectModals: null
    media: {}

  componentDidMount: ->
    @_boundForceUpdate = @forceUpdate.bind this
    @props.project.listen @_boundForceUpdate
    @fetchProjectModalsFor @props.project

  componentWillUnmount: ->
    @props.project.stopListening @_boundForceUpdate

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @props.project.stopListening @_boundForceUpdate
      nextProps.project.listen @_boundForceUpdate
      @fetchProjectModalsFor nextProps.project

  fetchProjectModalsFor: (project) ->
    @setState
      loading: true
      error: null
      projectModals: null
    apiClient.type('tutorials').get project_id: project.id
      .then (projectModals) =>
        filteredProjectModals = 
          if @props.kind is "tutorial"
            projectModal for projectModal in projectModals when projectModal.kind is @props.kind or projectModal.kind is null
          else if @props.kind is "mini-course"
            projectModal for projectModal in projectModals when projectModal.kind is @props.kind
        @setState {projectModals: filteredProjectModals}
      .catch (error) =>
        @setState {error}
      .then =>
        @setState loading: false

  render: ->
    if @state.loading
      <p>Loading...</p>
    else if @state.error?
      <p>{@state.error.toString()}</p>
    else if @state.projectModals?
      window?.editingProjectModals = @state.projectModals
      <div>
        {for projectModal in @state.projectModals
            <ProjectModalEditorController
              key={projectModal.id}
              project={@props.project}
              projectModal={projectModal}
              media={@state.media}
              kind={@props.kind}
              onDelete={@handleProjectModalCreateOrDelete}
            />}
        <hr />
        <ProjectModalCreator project={@props.project} kind={@props.kind} onCreate={@handleProjectModalCreateOrDelete} />
      </div>
    else
      <ProjectModalCreator project={@props.project} kind={@props.kind} onCreate={@handleProjectModalCreateOrDelete} />

  handleProjectModalCreateOrDelete: ->
    @fetchProjectModalsFor @props.project

module.exports = ProjectModalEditorFetcher
