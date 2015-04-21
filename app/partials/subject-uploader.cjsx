React = require 'react'
apiClient = require '../api/client'

NOOP = Function.prototype

putFile = (location, file) ->
  new Promise (resolve, reject) =>
    xhr = new XMLHttpRequest
    xhr.onreadystatechange = (e) =>
      if e.target.readyState is e.target.DONE
        if 200 <= e.target.status < 300
          resolve e.target
        else
          reject e.target
    xhr.open 'PUT', location
    xhr.send file

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

  componentDidMount: ->
    if @props.autoStart
      console.log 'Auto-starting'
      @start()

  render: ->
    <div className="subject-uploader">
      <p>Progress: <strong>{@state.current}</strong> / {@props.subjects.length}</p>

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
        .catch (error) =>
          console.error 'TODO: Handle subject creation error', error
        .then =>
          uploads = for typeToUploadURL, i in subject.locations
            uploadURL = typeToUploadURL[Object.keys(typeToUploadURL)[0]]
            putFile uploadURL, @props.files[subjectData.locations[i]]
          Promise.all uploads
        .catch (error) =>
          console.error 'TODO: Handle S3 upload error', error
        .then =>
          @state.batch.push subject
          @setState
            current: @state.current + 1, =>
              @processNext()

    else
      @finish()

  finish: ->
    newSubjectIDs = (id for {id} in @state.batch)
    @props.subjectSet.addLink 'subjects', newSubjectIDs
      .then =>
        @state.batch.splice 0

        if @state.current is @props.subjects.length
          @props.onComplete()

      .catch (error) =>
        console.error 'TODO: handle linking error', error

      .then =>
        if @isMounted()
          @setState inProgress: false
