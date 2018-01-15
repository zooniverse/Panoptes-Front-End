React = require 'react'
createReactClass = require 'create-react-class'

NOOP = Function.prototype

separateSubjects = (subjects, files, tooBig) ->
  ready = []
  incomplete = []
  missingFiles = []
  tooBigFiles = []

  for subject in subjects
    allLocationsHaveFiles = true
    for location in subject.locations
      unless location of files
        missingFiles.push location
        allLocationsHaveFiles = false
      if location of tooBig
        tooBigFiles.push location
    if allLocationsHaveFiles
      ready.push subject
    else
      incomplete.push subject

  {ready, incomplete, missingFiles, tooBigFiles}

module.exports = createReactClass
  displayName: 'ManifestView'

  statics:
    separateSubjects: separateSubjects

  getDefaultProps: ->
    name: ''
    errors: []
    subjects: []
    files: {}
    tooBigFiles: {}
    onRemove: NOOP

  getInitialState: ->
    showingErrors: false
    showingMissing: false
    showingReady: false

  render: ->
    {ready, incomplete, missingFiles, tooBigFiles} = separateSubjects @props.subjects, @props.files, @props.tooBigFiles

    <div className="manifest-view">
      <div>
        <strong>{@props.name}</strong>{' '}
        ({@props.subjects.length} subjects){' '}
        <button type="button" onClick={@props.onRemove}>&times;</button>
      </div>

      {unless @props.errors.length is 0
        <div>
          <i className="fa fa-exclamation-triangle fa-fw" style={color: 'orange'}></i>
          {@props.errors.length} parse errors{' '}
          <button type="button" className="secret-button" onClick={@toggleState.bind this, 'showingErrors'}>
            <i className="fa fa-eye fa-fw"></i>
          </button>
          <br />
          {if @state.showingErrors
            <ul>
              {for {row, message} in @props.errors
                <li key={row + message}>Row {row}: {message}</li>}
            </ul>}
        </div>}

      {unless missingFiles.length is 0
        <div>
          <i className="fa fa-exclamation-circle fa-fw" style={color: 'red'}></i>
          {missingFiles.length} missing files from {incomplete.length} subjects{' '}
          <button type="button" className="secret-button" onClick={@toggleState.bind this, 'showingMissing'}>
            <i className="fa fa-eye fa-fw"></i>
          </button>
          <br />
          {if @state.showingMissing
            <ul>
              {for file, i in missingFiles
                <li key={i}>{file}{' is too large' if file in tooBigFiles}</li>}
            </ul>}
        </div>}

      <div>
        <i className="fa fa-thumbs-up fa-fw" style={color: 'green'}></i>
        {ready.length} subjects ready to load{' '}
        <button type="button" className="secret-button" onClick={@toggleState.bind this, 'showingReady'}>
          <i className="fa fa-eye fa-fw"></i>
        </button>
        {if @state.showingReady
          <ul>
            {for {locations, metadata}, i in ready
              <li key={i}>
                {for location in locations
                  <div key={location}>{location}</div>}
                <table className="standard-table">
                  {for key, value of metadata
                    <tr key={key}>
                      <th>{key}</th>
                      <td key={key}>{value}</td>
                    </tr>}
                </table>
              </li>}
          </ul>}
      </div>
    </div>

  toggleState: (key) ->
    newState = {}
    newState[key] = not @state[key]
    @setState newState
