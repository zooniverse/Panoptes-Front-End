React = require 'react'
apiClient = require '../../api/client'

module.exports = React.createClass
  getDefaultProps: ->
    project: null
    workflow: null
    files: []
    onClose: ->

  getInitialState: ->
    classificationsByFile: {}
    errorsByFile: {}
    inProgress: {}

  componentDidMount: ->
    @parseFiles @props.files

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.files is @props.files
      @parseFiles nextProps.files

  parseFiles: (files) ->
    @setState
      classificationsByFile: {}
      errorsByFile: {}
      inProgress: {}
    Array::forEach.call files, (file) =>
      reader = new FileReader
      reader.onload = @handleFileRead.bind this, file
      reader.readAsText file

  handleFileRead: (file, e) ->
    try
      @state.classificationsByFile[file.name] = [].concat JSON.parse e.target.result
      @setState classificationsByFile: @state.classificationsByFile
    catch parseError
      @state.errorsByFile[file.name] = parseError
      @setState errorsByFile: @state.errorsByFile

  startImport: ->
    for fileName, classifications of @state.classificationsByFile
      [Promise.resolve(), classifications...].reduce (awaitPreviousSave, classification, i1) =>
        i = i1 - 1 # Array::reduce starts at 1.
        awaitPreviousSave.then =>
          @state.inProgress[fileName + i] = true
          @setState inProgress: @state.inProgress
          @importClassification classification
            .then =>
              @state.inProgress[fileName + i] = false
            .catch (error) =>
              @state.inProgress[fileName + i] = {error}
            .then =>
              @setState inProgress: @state.inProgress

  importClassification: (classification) ->
    data = JSON.parse JSON.stringify classification
    Object.assign data,
      gold_standard: true
    Object.assign data.links,
      project: @props.project.id
      workflow: @props.workflow.id
    console.log JSON.parse JSON.stringify apiClient.type('classifications').create(data)#.save()
    Promise.resolve()

  render: ->
    classificationsCount = 0
    for fileName, classifications of @state.classificationsByFile
      classificationsCount += classifications.length

    <div>
      <header>Import gold standard classifications</header>
      <ul>
        {Array::map.call @props.files, (file) =>
          <li>
            <header>{file.name}</header>
            {if @state.errorsByFile[file.name]?
              <strong>
                <i className="fa fa-exclamation-triangle"></i>{' '}
                {@state.errorsByFile[file.name].toString()}
              </strong>
            else if @state.classificationsByFile[file.name]?.length > 0
              <ul>
                {@state.classificationsByFile[file.name].map (classification, i) =>
                  progress = @state.inProgress[file.name + i]
                  <li>
                    {classification.links.subjects.join ', '}{' '}
                    {if progress? then switch progress
                      when true then '· · ·'
                      when false then 'OK'
                      else progress.toString()}
                  </li>}
              </ul>}
          </li>}
      </ul>

      <p>
        <button type="button" className="minor-button" onClick={@props.onClose}>Close</button>{' '}
        <button type="button" className="major-button" disabled={classificationsCount is 0} onClick={@startImport}>Import {classificationsCount}</button>
      </p>
    </div>
