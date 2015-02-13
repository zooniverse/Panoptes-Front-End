{Model} = require 'json-api-client'

languages = ['en-us'] # TODO: Where should this live?

DEFAULT_DATA =
  language: languages[0]
  name: ''
  introduction: ''
  description: ''
  scienceCase: ''
  subjects: {}
  manifests: {}
  tasks: '{}'

newProjectData = new Model
  refresh: ->
    newProjectData.update JSON.parse JSON.stringify DEFAULT_DATA

  handleInputChange: (e) ->
    valueProperty = switch e.target.type
      when 'radio', 'checkbox' then 'checked'
      when 'file' then 'files'
      else 'value'

    changes = {}
    changes[e.target.name] = e.target[valueProperty]

    @update changes

  getSubjects: ->
    missing = []
    loose = []
    inManifest = []

    manifestedSubjectFilenames = []

    for manifest, subjects of @manifests
      for metadata in subjects
        manifestedSubjectFilenames.push metadata.filenames...

        files = (@subjects[filename] ? null for filename in metadata.filenames)
        if null in files
          missing.push {files, metadata}
        else
          inManifest.push {files, metadata}

    for filename, file of @subjects when filename not in manifestedSubjectFilenames
      files = [file]
      loose.push {files}

    [missing..., loose..., inManifest...]


newProjectData.refresh()

module.exports = newProjectData
