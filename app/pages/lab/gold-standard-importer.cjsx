React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
counterpart = require 'counterpart'

module.exports = React.createClass
  IN_PROGRESS: 'IN_PROGRESS'
  SUCCESSFUL: 'SUCCESSFUL'

  getDefaultProps: ->
    project: null
    workflow: null
    files: []
    onClose: ->

  getInitialState: ->
    classificationsByFile: {}
    errorsByFile: {}
    progress: {}

  componentDidMount: ->
    @parseFiles @props.files

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.files is @props.files
      @parseFiles nextProps.files

  parseFiles: (files) ->
    @setState
      classificationsByFile: {}
      errorsByFile: {}
      progress: null
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
    @setState
      progress: {}
    Object.keys(@state.classificationsByFile).forEach (fileName) =>
      classifications = @state.classificationsByFile[fileName]
      classifications.reduce ((awaitPreviousSave, classification, i) =>
        stateKey = fileName + i
        awaitPreviousSave.then =>
          @importClassification classification, stateKey
      ), Promise.resolve()

  importClassification: (classification, stateKey) ->
    @state.progress[stateKey] = @IN_PROGRESS
    @setState progress: @state.progress

    data = JSON.parse JSON.stringify classification
    Object.assign data,
      gold_standard: true
      links: Object.assign data.links,
        project: @props.project.id
        workflow: @props.workflow.id
      metadata: Object.assign {}, data.metadata,
        user_agent: 'Importer'
        workflow_version: @props.workflow.version
        user_language: counterpart.getLocale()
        started_at: new Date().toISOString()
        finished_at: new Date().toISOString()

    apiClient.type('classifications').create(data).save()
      .then =>
        @state.progress[stateKey] = @SUCCESSFUL
      .catch (creationError) =>
        @state.progress[stateKey] = creationError
      .then =>
        @setState progress: @state.progress

  render: ->
    classificationsCount = 0
    for fileName, classifications of @state.classificationsByFile
      classificationsCount += classifications.length

    <div>
      <header>Import gold standard classifications</header>
      <ul>
        {Array::map.call @props.files, (file) =>
          <li key={file.name}>
            <header>{file.name}</header>
            {if @state.errorsByFile[file.name]?
              <strong>
                <i className="fa fa-exclamation-triangle"></i>{' '}
                {@state.errorsByFile[file.name].toString()}
              </strong>
            else if @state.classificationsByFile[file.name]?.length > 0
              <ul>
                {@state.classificationsByFile[file.name].map (classification, i) =>
                  stateKey = file.name + i
                  progress = @state.progress?[stateKey]
                  <li key={stateKey}>
                    {classification.links.subjects.join ', '}{' '}
                    {if progress? then switch progress
                      when @IN_PROGRESS then <i className="fa fa-spinner fa-spin"></i>
                      when @SUCCESSFUL then <i className="fa fa-check-circle"></i>
                      else <span>
                        <i className="fa fa-exclamation-circle"></i>{' '}
                        progress.toString()
                      </span>}
                  </li>}
              </ul>}
          </li>}
      </ul>

      <p>
        <button type="button" className="minor-button" onClick={@props.onClose}>Close</button>{' '}
        <button type="button" className="major-button" disabled={classificationsCount is 0 or @state.progress?} onClick={@startImport}>Import {classificationsCount}</button>
      </p>
    </div>
