React = require 'react'
apiClient = require '../../api/client'
putFile = require '../../lib/put-file'
FileButton = require '../../components/file-button'
{MarkdownEditor} = require 'markdownz'
debounce = require 'debounce'

TutorialStepEditor = React.createClass
  getDefaultProps: ->
    step: null
    media: null

    onChange: ->
      console.log 'TutorialStepEditor onChange', arguments

    onMediaSelect: ->
      console.log 'TutorialStepEditor onMediaSelect', arguments

    onMediaClear: ->
      console.log 'TutorialStepEditor onMediaClear', arguments

    onRemove: ->
      console.log 'TutorialStepEditor onRemove', arguments

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


TutorialEditor = React.createClass
  getDefaultProps: ->
    tutorial: null
    media: null

    onStepAdd: ->
      console.log 'TutorialEditor onStepAdd', arguments

    onStepRemove: ->
      console.log 'TutorialEditor onStepRemove', arguments

    onMediaSelect: ->
      console.log 'TutorialEditor onMediaSelect', arguments

    onStepChange: ->
      console.log 'TutorialEditor onChange', arguments

  render: ->
    <div>
      <div>
        <p>Here’s some text all about the tutorial editor. Lorem ipsum dolor sit amet, etc.</p>
        <p><strong>Work in progress.</strong></p>
      </div>
      <div>
        {if @props.tutorial.steps.length is 0
          <p>This tutorial has no steps.</p>
        else
          for step, i in @props.tutorial.steps
            step._key ?= Math.random()
            <TutorialStepEditor
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


TutorialEditorController = React.createClass
  getDefaultProps: ->
    project: null
    tutorial: null
    media: {}
    delayBeforeSave: 5000

    onChangeMedia: ->
      console.log 'TutorialEditorController onChangeMedia', arguments

    onDelete: ->
      console.log 'TutorialEditorController onDelete', arguments

  componentDidMount: ->
    @_boundForceUpdate = @forceUpdate.bind this
    @props.tutorial.listen @_boundForceUpdate

  componentWillUnmount: ->
    @props.tutorial.stopListening @_boundForceUpdate

  render: ->
    <TutorialEditor
      tutorial={@props.tutorial}
      media={@props.media}
      onStepAdd={@handleStepAdd}
      onStepRemove={@handleStepRemove}
      onMediaSelect={@handleStepMediaChange}
      onMediaClear={@handleStepMediaClear}
      onStepChange={@handleStepChange}
    />

  handleStepAdd: ->
    @props.tutorial.steps.push
      media: ''
      content: ''
    @props.tutorial.update 'steps'
    @props.tutorial.save()

  handleStepRemove: (index) ->
    @handleStepMediaClear index

    changes = {}
    changes["steps.#{index}"] = undefined
    @props.tutorial.update changes

    if @props.tutorial.steps.length is 0
      @props.tutorial.delete()
        .then =>
          @props.onDelete()
    else
      @props.tutorial.save()

  handleStepMediaChange: (index, file) ->
    @handleStepMediaClear index

    payload =
      media:
        content_type: file.type
        metadata:
          filename: file.name

    apiClient.post @props.tutorial._getURL('attached_images'), payload
      .then (media) =>
        media = [].concat(media)[0]
        putFile media.src, file
          .then =>
            changes = {}
            changes["steps.#{index}.media"] = media.id
            @props.tutorial.update changes
            @props.tutorial.save()
              .then =>
                @props.onChangeMedia()
      .catch (error) =>
        console.error error

  handleStepMediaClear: (index) ->
    @props.media[@props.tutorial.steps[index].media]?.delete()
    changes = {}
    changes["steps.#{index}.media"] = undefined
    @props.tutorial.update changes
    @props.tutorial.save()

  handleStepChange: (index, key, value) ->
    changes = {}
    changes["steps.#{index}.#{key}"] = value
    @props.tutorial.update changes
    @saveTutorial()

  saveTutorial: ->
    unless @_debouncedSaveTutorial?
      boundTutorialSave = @props.tutorial.save.bind @props.tutorial
      @_debouncedSaveTutorial = debounce boundTutorialSave, @props.delayBeforeSave
    @_debouncedSaveTutorial arguments...


TutorialCreator = React.createClass
  getDefaultProps: ->
    project: null

    onCreate: ->
      console.log 'TutorialCreator onCreate', arguments

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
    tutorialData =
      steps: []
      language: 'en'
      links:
        project: @props.project.id

    @setState error: null
    apiClient.type('tutorials').create(tutorialData).save()
      .then (tutorial) =>
        @props.onCreate tutorial
      .catch (error) =>
        @setState {error}


TutorialEditorFetcher = React.createClass
  getDefaultProps: ->
    project: null

  getInitialState: ->
    loading: false
    error: null
    tutorial: null
    media: {}

  componentDidMount: ->
    @_boundForceUpdate = @forceUpdate.bind this
    @props.project.listen @_boundForceUpdate
    @fetchTutorialFor @props.project

  componentWillUnmount: ->
    @props.project.stopListening @_boundForceUpdate

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @props.project.stopListening @_boundForceUpdate
      nextProps.project.listen @_boundForceUpdate
      @fetchTutorialFor nextProps.project

  fetchTutorialFor: (project) ->
    @setState
      loading: true
      error: null
      tutorial: null
    apiClient.type('tutorials').get project_id: project.id
      .then ([tutorial]) =>
        @setState {tutorial}
        @fetchMediaFor tutorial
      .catch (error) =>
        @setState {error}
      .then =>
        @setState loading: false

  fetchMediaFor: (tutorial) ->
    if tutorial?
      tutorial.get 'attached_images', {} # Prevent caching.
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
      <p>Loading tutorial...</p>
    else if @state.error?
      <p>{@state.error.toString()}</p>
    else if @state.tutorial?
      window?.editingTutorial = @state.tutorial
      <TutorialEditorController
        project={@props.project}
        tutorial={@state.tutorial}
        media={@state.media}
        onChangeMedia={@handleChangeToMedia}
        onDelete={@handleTutorialCreateOrDelete}
      />
    else
      <TutorialCreator project={@props.project} onCreate={@handleTutorialCreateOrDelete} />

  handleChangeToMedia: ->
    @fetchMediaFor @state.tutorial

  handleTutorialCreateOrDelete: ->
    @fetchTutorialFor @props.project

module.exports = TutorialEditorFetcher
