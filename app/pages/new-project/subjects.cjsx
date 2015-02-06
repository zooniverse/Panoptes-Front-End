React = require 'react'
data = require './data'
{Link} = require 'react-router'

MANIFEST_COLUMNS = ['filenames', 'timestamps', 'coord[0]', 'coord[1]', 'rotation', 'coords_type']

module.exports = React.createClass
  displayName: 'NewProjectSubjectsPage'

  render: ->
    <div className="content-container">
      <h2>Create a set of subjects</h2>
      <p>Now you’ll be able to choose the images you want volunteers to look at (JPEG, PNG, or GIF, please). Optionally, you can include metadata about the images with a manifest file <small>(TODO: describe the manifest)</small>.</p>
      <p>These images will be uploaded during after last step of this process, which could take a long time depending on how many you select. Make sure you’ve got a steady internet connection. You’ll have an opportunity to review and refine your selection here before continuing.</p>

      {for manifestFilename of data.manifests
        <span key={manifestFilename}>
          {manifestFilename}
          <button onClick={@removeManifest.bind this, manifestFilename}>&times;</button>
          &emsp;
        </span>}

      <table>
        <thead>
          <tr>
            {for column in MANIFEST_COLUMNS
              <th key={column}>{column}</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {@_renderSubjectRows()}
        </tbody>
      </table>

      <p><input type="file" accept="image/*,text/tab-separated-values" multiple="multiple" onChange={@handleSubjectFilesChange} /></p>
      <Link to="new-project-workflow">Next, create a workflow <i className="fa fa-arrow-right"></i></Link>
    </div>

  _renderSubjectRows: ->
    manifests = Object.keys(data.manifests).length isnt 0

    for {files, metadata} in data.getSubjects()
      filenames = metadata?.filenames ? (name for {name} in files)

      <tr key={filenames.join()}>
        <td>
          {for filename, i in filenames
            <div key={filename}>
              {filename}
              {unless files[i]?
                <span className="form-help error" title="Missing image">&nbsp;<i className="fa fa-exclamation-circle"></i></span>}
            </div>}
          {if manifests and not metadata?
            <div className="form-help warning"><i className="fa fa-exclamation-triangle"></i> Not present in any manifest</div>}
        </td>

        {for column in MANIFEST_COLUMNS[1...]
          <td key={column}>{metadata?[column] ? <span className="form-help">?</span>}</td>}

        <td>
          <button onClick={@removeSubjects.bind this, filenames...}>&times;</button>
        </td>
      </tr>

  removeSubjects: (filenames...) ->
    for filename in filenames
      delete data.subjects[filename]
    # TODO: Remove them from all the manifests too, so they don't appear to be missing.
    data.update 'subjects'

  removeManifest: (filename) ->
    delete data.manifests[filename]
    data.update 'manifests'

  handleSubjectFilesChange: (e) ->
    thingsBeingProcessed = for file in e.target.files
      if file.type in ['text/csv', 'text/tab-separated-values']
        @_addManifest file
      else if file.type.indexOf('image/') is 0
        data.subjects[file.name] = file

    Promise.all(thingsBeingProcessed).then =>
      data.update 'subjects'

  _addManifest: (file) ->
    newlines = /\n|\r\n|\r/

    columnDelimiter = switch file.type
      # TODO: Parse these files properly.
      when 'text/csv' then  ','
      when 'text/tab-separated-values' then '\t'

    listDelimeter = ';'

    new Promise (resolve) =>
      reader = new FileReader
      reader.onload = =>
        data.manifests[file.name] ?= []
        for line in reader.result.split newlines when line
          metadataInOrder = line.split columnDelimiter

          metadata = {}
          for key, i in MANIFEST_COLUMNS when metadataInOrder[i]?
            metadata[key] = metadataInOrder[i]

          if metadata.filenames?
            metadata.filenames = metadata.filenames.split listDelimeter

          for imageFilename in metadata.filenames
            data.manifests[file.name].push metadata

        resolve()

      reader.readAsText file
