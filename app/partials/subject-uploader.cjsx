React = require 'react'
apiClient = require '../api/client'
putFile = require '../lib/put-file'

NOOP = Function.prototype

module.exports = React.createClass
  displayName: 'SubjectUploader'

  getDefaultProps: ->
    subjects: []
    files: {}
    project: null
    subjectSet: null
    autoStart: false
    onComplete: NOOP

  getInitialState: ->
    inProgress: false
    current: 0
    batch: []
    successes: []
    errors: []

  componentDidMount: ->
    if @props.autoStart
      console.log 'Auto-starting'
      @start()

  render: ->
    <div className="subject-uploader">
      <p>Progress: <strong>{@state.current}</strong> / {@props.subjects.length}</p>

      {unless @state.errors.length is 0
        <ul>
          {for error in @state.errors
            error._key ?= Math.random()
            <li key={error._key} className="form-help error">{error.toString()}</li>}
        </ul>}

      <p className="columns-container">
        <button type="button" className="standard-button" disabled={not @state.inProgress} onClick={@finish}>Pause</button>
        <button type="button" className="major-button" disabled={@state.inProgress or @state.current is @props.subjects.length} onClick={@start}>Start</button>
      </p>
    </div>

  start: ->
    @setState inProgress: true, =>
      @processNext()

  processNext: ->
    subjectData = @props.subjects[@state.current]

    if subjectData? and @state.inProgress
      locationTypes = for filename in subjectData.locations
        @props.files[filename].type

      subject = apiClient.type('subjects').create
        # Locations are sent as a list of mime types.
        locations: locationTypes
        metadata: subjectData.metadata
        links:
          project: @props.project.id

      subject.save()
        .then =>
          uploads = for typeToUploadURL, i in subject.locations
            uploadURL = typeToUploadURL[Object.keys(typeToUploadURL)[0]]
            putFile uploadURL, @props.files[subjectData.locations[i]]
          Promise.all uploads
        .then (success) =>
          @setState
            successes: @state.successes.concat success
            batch: @state.batch.concat subject
        .catch (error) =>
          @setState
            errors: @state.errors.concat error
        .then =>
          @setState
            current: @state.current + 1, =>
              @processNext()

    else
      @finish()

  finish: ->
    unless @state.batch is 0
      newSubjectIDs = (id for {id} in @state.batch)
      @props.subjectSet.addLink 'subjects', newSubjectIDs
        .then =>
          @state.batch.splice 0

          if @state.current is @props.subjects.length
            @props.onComplete
              successes: @state.successes
              errors: @state.errors

        .catch (error) =>
          @setState
            errors: @state.errors.concat error

        .then =>
          if @isMounted()
            @setState inProgress: false
