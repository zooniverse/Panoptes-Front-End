React = require 'react'
createReactClass = require 'create-react-class'
apiClient = require 'panoptes-client/lib/api-client'
putFile = require '../lib/put-file'

NOOP = Function.prototype

module.exports = createReactClass
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
    creates: []
    uploads: []
    errors: []

  componentDidMount: ->
    if @props.autoStart
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
        .then (subject) =>
          uploads = for typeToUploadURL, i in subject.locations
            uploadURL = typeToUploadURL[Object.keys(typeToUploadURL)[0]]
            headers =
              'Content-Type': locationTypes[i]
            putFile uploadURL, @props.files[subjectData.locations[i]], headers
          Promise.all(uploads).then (uploads) =>
            @setState
              creates: @state.creates.concat subject
            uploads
        .then (success) =>
          @setState
            uploads: @state.uploads.concat success
            batch: @state.batch.concat subject
        .catch (error) =>
          subject.delete()

          @setState
            errors: @state.errors.concat error
        .then =>
          @setState
            current: @state.current + 1, =>
              @processNext()

    else
      @finish()

  finish: ->
    unless @state.batch.length is 0
      newSubjectIDs = (id for {id} in @state.batch)
      linkToSubjectSet = @props.subjectSet.addLink 'subjects', newSubjectIDs
        .then =>
          @state.batch.splice 0
        .catch (error) =>
          @setState
            errors: @state.errors.concat error

    linkToSubjectSet ?= Promise.resolve()
    linkToSubjectSet.then =>
      if @state.current is @props.subjects.length
        @props.onComplete
          creates: @state.creates
          uploads: @state.uploads
          errors: @state.errors
      if @isMounted()
        @setState inProgress: false
