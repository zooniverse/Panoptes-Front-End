React = require 'react'
apiClient = require '../../api/client'
putFile = require '../../lib/put-file'
FileButton = require '../../components/file-button'
{MarkdownEditor} = require 'markdownz'
debounce = require 'debounce'

apiClient.type('tutorials').create
  id: 'DEV_TUTORIAL'
  steps: [{
    media: ''
    content: 'This is the first step.'
  }, {
    media: ''
    content: 'And this is the second step.'
  }]


TutorialStepEditor = React.createClass
  getDefaultProps: ->
    step: null

    onChange: ->
      console.log 'TutorialStepEditor onChange', arguments

    onMediaSelect: ->
      console.log 'TutorialStepEditor onMediaSelect', arguments

    onRemove: ->
      console.log 'TutorialStepEditor onRemove', arguments

  render: ->
    <div style={border: '1px solid'}>
      <header>
        <button type="button" onClick={@props.onRemove}>Remove step</button>
      </header>
      <div>
        <header>Media</header>
        {if @props.step.media
          <div>
            <img src={@props.step.media} />
            <button type="button">Clear media</button>
          </div>
        else
          <small>(None)</small>}
        <br />
        <FileButton onSelect={@handleMediaChange}>Select</FileButton>
      </div>
      <div>
        <header>Content</header>
        <br />
        <MarkdownEditor value={@props.step.content} onChange={@handleContentChange} />
      </div>
    </div>

  handleMediaChange: (e) ->
    @props.onMediaSelect e.target.files[0], arguments...

  handleContentChange: (e) ->
    @props.onChange 'content', e.target.value, arguments...


TutorialEditor = React.createClass
  getDefaultProps: ->
    tutorial: []

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
        <p>Here’s some text all about the tutorial editor.</p>
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
              onMediaSelect={@props.onMediaSelect.bind null, i}
              onChange={@props.onStepChange.bind null, i}
              onRemove={@props.onStepRemove.bind null, i}
            />}
      </div>
      <div>
        <button type="button" onClick={@props.onStepAdd}>+</button>
      </div>
    </div>


TutorialEditorController = React.createClass
  getDefaultProps: ->
    project: null
    tutorial: null
    delayBeforeSave: 5000

    onDelete: ->
      console.log 'TutorialEditorController onDelete', arguments

  componentDidMount: ->
    @_boundForceUpdate = @forceUpdate.bind this
    @props.tutorial.listen @_boundForceUpdate

  componentWillUnmount: ->
    @props.tutorial.stopListening @_boundForceUpdate
    @_boundForceUpdate = null

  render: ->
    <TutorialEditor
      tutorial={@props.tutorial}
      onStepAdd={@handleAddStep}
      onStepRemove={@handleStepRemove}
      onMediaSelect={@handleStepMediaChange}
      onStepChange={@handleStepChange}
    />

  handleAddStep: ->
    @props.tutorial.steps.push
      media: ''
      content: ''
    @props.tutorial.update 'steps'
    @saveTutorial()

  handleStepRemove: (index) ->
    changes = {}
    changes["steps.#{index}"] = undefined
    @props.tutorial.update changes
    if @props.tutorial.steps.length is 0
      @props.tutorial.delete()
        .then =>
          @props.onDelete()
    else
      @saveTutorial()

  handleStepMediaChange: (index, file) ->
    payload =
      media:
        content_type: file.type
        metadata:
          filename: file.name

    apiClient.post @props.tutorial._getURL('attached_images'), payload
      .then (media) =>
        media = [].concat(media)[0]
        if media?
          changes = {}
          changes["steps.#{index}.media"] = media.id
          @props.tutorial.update changes
          @saveTutorial()
      .catch (error) =>
        console.error error

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
      <p>This project doesn’t have a tutorial yet.</p>
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

  componentDidMount: ->
    @_boundForceUpdate = @forceUpdate.bind this
    @props.project.listen @_boundForceUpdate
    @fetchTutorialFor @props.project

  componentWillUnmount: ->
    @props.project.stopListening @_boundForceUpdate
    @_boundForceUpdate = null

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
    apiClient.type('tutorials').get project_id: @props.project?.id
      .then ([tutorial]) =>
        @setState {tutorial}
      .catch (error) =>
        @setState {error}
      .then =>
        @setState loading: false

  render: ->
    if @state.loading
      <p>Loading...</p>
    else if @state.error?
      <p>{@state.error.toString()}</p>
    else if @state.tutorial?
      window?.editingTutorial = @state.tutorial
      <TutorialEditorController project={@props.project} tutorial={@state.tutorial} onDelete={@handleTutorialCreateOrDelete} />
    else
      <TutorialCreator project={@props.project} onCreate={@handleTutorialCreateOrDelete} />

  handleTutorialCreateOrDelete: ->
    @fetchTutorialFor @props.project

module.exports = TutorialEditorFetcher
