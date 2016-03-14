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
    <div style={
      border: '1px solid'
      marginBottom: '1em'
    }>
      <header>
        <button type="button" onClick={@props.onRemove}>Remove step</button>
      </header>
      <div>
        <header>Media</header>
        {if @props.media?
          <div>
            <img src={@props.media.src} style={
              maxHeight: '5em'
              maxWidth: '100%'
            } />
            <button type="button" className="minor-button" onClick={@props.onMediaClear}>Clear media</button>
          </div>}
        <FileButton className="standard-button" onSelect={@handleMediaChange}>Select</FileButton>
      </div>
      <div>
        <header>Content</header>
        <MarkdownEditor value={@props.step.content} onChange={@handleContentChange} />
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
    type: null

    onStepAdd: ->
      console.log 'ProjectModalEditor onStepAdd', arguments

    onStepRemove: ->
      console.log 'ProjectModalEditor onStepRemove', arguments

    onMediaSelect: ->
      console.log 'ProjectModalEditor onMediaSelect', arguments

    onStepChange: ->
      console.log 'ProjectModalEditor onChange', arguments

  render: ->
      <div>
        {if @props.projectModal.steps.length is 0
          <p>This tutorial has no steps.</p>
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
      </div>
      <div>
        <button type="button" onClick={@props.onStepAdd}>Add a step</button>
      </div>
    </div>

ProjectModalEditorController = React.createClass
  getDefaultProps: ->
    project: null
    projectModal: null
    media: {}
    delayBeforeSave: 5000
    type: null

    onChangeMedia: ->
      console.log 'ProjectModalEditorController onChangeMedia', arguments

    onDelete: ->
      console.log 'ProjectModalEditorController onDelete', arguments

  componentDidMount: ->
    @_boundForceUpdate = @forceUpdate.bind this
    @props.projectModal.listen @_boundForceUpdate

  componentWillUnmount: ->
    @props.projectModal.stopListening @_boundForceUpdate

  render: ->
    <ProjectModalEditor
      projectModal={@props.projectModal}
      media={@props.media}
      type={@props.type}
      onStepAdd={@handleStepAdd}
      onStepRemove={@handleStepRemove}
      onMediaSelect={@handleStepMediaChange}
      onMediaClear={@handleStepMediaClear}
      onStepChange={@handleStepChange}
    />

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
        putFile media.src, file
          .then =>
            changes = {}
            changes["steps.#{index}.media"] = media.id
            @props.projectModal.update changes
            @props.projectModal.save()
              .then =>
                @props.onChangeMedia()
      .catch (error) =>
        console.error error

  handleStepMediaClear: (index) ->
    @props.media[@props.projectModal.steps[index].media]?.delete()
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
    type: null

    onCreate: ->
      console.log 'ProjectModalCreator onCreate', arguments

  getInitialState: ->
    error: null

  render: ->
    <div>
      <p>This project doesn’t have a tutorial.</p>
      {if @state.error?
          <p>{@state.error.toString()}</p>}
      <p>
        <button type="button" onClick={@handleCreateClick}>Build one</button>
      </p>
    </div>

  handleCreateClick: ->
    projectModalType = @props.type
    projectModalData =
      steps: []
      language: 'en'
      links:
        project: @props.project.id

    @setState error: null
    apiClient.type(projectModalType).create(projectModalData).save()
      .then (createdProjectModal) =>
        @props.onCreate createdProjectModal
      .catch (error) =>
        @setState {error}

ProjectModalEditorFetcher = React.createClass
  getDefaultProps: ->
    project: null
    type: null

  getInitialState: ->
    loading: false
    error: null
    projectModal: null
    media: {}

  componentDidMount: ->
    @_boundForceUpdate = @forceUpdate.bind this
    @props.project.listen @_boundForceUpdate
    @fetchProjectModalFor @props.project

  componentWillUnmount: ->
    @props.project.stopListening @_boundForceUpdate

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @props.project.stopListening @_boundForceUpdate
      nextProps.project.listen @_boundForceUpdate
      @fetchProjectModalFor nextProps.project

  fetchProjectModalFor: (project) ->
    @setState
      loading: true
      error: null
      projectModal: null
    apiClient.type(@props.type).get project_id: project.id
      .then ([projectModal]) =>
        @setState {projectModal}
        @fetchMediaFor projectModal
      .catch (error) =>
        @setState {error}
      .then =>
        @setState loading: false

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
    if @state.loading
      <p>Loading...</p>
    else if @state.error?
      <p>{@state.error.toString()}</p>
    else if @state.projectModal?
      window?.editingProjectModal = @state.projectModal
      <ProjectModalEditorController
        project={@props.project}
        projectModal={@state.projectModal}
        media={@state.media}
        type={@props.type}
        onChangeMedia={@handleChangeToMedia}
        onDelete={@handleProjectModalCreateOrDelete}
      />
    else
      <ProjectModalCreator project={@props.project} type={@props.type} onCreate={@handleProjectModalCreateOrDelete} />

  handleChangeToMedia: ->
    @fetchMediaFor @state.projectModal

  handleProjectModalCreateOrDelete: ->
    @fetchProjectModalFor @props.project

module.exports = ProjectModalEditorFetcher