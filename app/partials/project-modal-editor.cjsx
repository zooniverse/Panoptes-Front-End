React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
putFile = require '../lib/put-file'
FileButton = require '../components/file-button'
{MarkdownEditor} = require 'markdownz'
debounce = require 'debounce'
DragReorderable = require 'drag-reorderable'
classnames = require 'classnames'
AutoSave = require '../components/auto-save'
handleInputChange = require '../lib/handle-input-change'

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

  render: ->
    <div className="project-modal-step-editor">
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

    onStepOrderChange: ->
      console.log 'ProjectModalEditor onStepOrderChange', arguments

  getInitialState: ->
    stepToEdit: 0

  onClick: (stepIndex) ->
    @setState stepToEdit: stepIndex

  handleStepRemove: (stepToRemove) ->
    if @props.projectModal.steps.length is 0
      stepIndex = null
    else
      stepIndex = 0

    @setState { stepToEdit: stepIndex }, -> @props.onStepRemove stepToRemove

  handleStepReorder: (stepsInNewOrder) ->
    stepReorderedIndex = null

    for step, index in stepsInNewOrder
      stepReorderedIndex = index if @props.projectModal.steps[@state.stepToEdit].content is step.content

    @props.onStepOrderChange stepsInNewOrder
    @setState stepToEdit: stepReorderedIndex

  handleStepAdd: ->
    @props.onStepAdd()
    @setState stepToEdit: @props.projectModal.steps.length - 1

  renderStepList: (step, i) ->
    step._key ?= Math.random()
    buttonClasses = classnames
      "selected": @state.stepToEdit is i
      "project-modal-step-list-item-button": true

    <li key={step._key} className="project-modal-step-list-item">
      <button type="button" className={buttonClasses} onClick={@onClick.bind null, i}>
        <span className="project-modal-step-list-item-button-title">Step #{i + 1}</span>
      </button>
      <button type="button" className="project-modal-step-list-item-remove-button" title="Remove this step" onClick={@handleStepRemove.bind null, i}>
        <i className="fa fa-trash-o fa-fw"></i>
      </button>
    </li>

  render: ->
    <div className="project-modal-editor">
      <div className="project-modal-header">
        <AutoSave tag="label" resource={@props.projectModal}>
          <span className="form-label">{@props.kind} #{@props.projectModal.id}</span>
          <br />
          <input type="text" name="display_name" value={@props.projectModal.display_name} className="standard-input full" onChange={handleInputChange.bind @props.projectModal} />
        </AutoSave>
        <p><button className="pill-button" onClick={@props.onProjectModalDelete}>Delete {@props.kind}</button></p>
      </div>
      {if @props.projectModal.steps.length is 0
        <p>This {@props.kind} has no steps.</p>
      else
        <div className="project-modal-step-editor-container">
          <DragReorderable tag="ul" className="project-modal-step-list" items={@props.projectModal.steps} render={@renderStepList} onChange={@handleStepReorder} />
          <ProjectModalStepEditor
            step={@props.projectModal.steps[@state.stepToEdit]}
            media={@props.media?[@props.projectModal.steps[@state.stepToEdit].media]}
            onMediaSelect={@props.onMediaSelect.bind null, @state.stepToEdit}
            onMediaClear={@props.onMediaClear.bind null, @state.stepToEdit}
            onChange={@props.onStepChange.bind null, @state.stepToEdit}
          />
        </div>}
      <div>
        <button type="button" onClick={@handleStepAdd}>Add a step</button>
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
        onStepOrderChange={@handleStepOrderChange}
        onProjectModalDelete={@handleProjectModalDelete}
      />
    </div>

  deleteProjectModal: ->
    @props.projectModal.delete()
      .then =>
        @props.onDelete()

  handleProjectModalDelete: ->
    if @props.projectModal.steps.length > 0
      for step in @props.projectModal.steps
        # Always pass in first index into step remove, because step deletion changes length
        # i.e. index 3 will be undefined in an originally 4 item length array after first is deleted
        # but iterate through the length of the original step array.
        @handleStepRemove(0)
    else
      @deleteProjectModal()

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
      @deleteProjectModal()
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

  handleStepOrderChange: (stepsInNewOrder) ->
    @props.projectModal.update steps: stepsInNewOrder
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
      display_name: "new #{@props.kind} title"

    @setState error: null
    apiClient.type('tutorials').create(projectModalData).save()
      .then (createdProjectModal) =>
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
