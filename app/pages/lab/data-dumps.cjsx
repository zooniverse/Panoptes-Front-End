React = require 'react'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'
counterpart = require 'counterpart'
DataExportButton = require '../../partials/data-export-button'
TalkDataExportButton = require '../../talk/data-export-button'

counterpart.registerTranslations 'en',
  projectDetails:
    classificationExport: "Request new classification export"
    subjectExport: "Request new subject export"
    workflowExport: "Request new workflow export"
    workflowContentsExport: "Request new workflow contents export"
    commentsExport: "Request new talk comments export"
    tagsExport: "Request new talk tags export"

module.exports = React.createClass
  displayName: 'GetDataExports'

  getDefaultProps: ->
    project: {}

  getInitialState: ->
    avatarError: null
    backgroundError: null

  render: ->
    <div>
      <p className="form-help">Get your project's data exports</p>
      <div className="columns-container">
        <div>
          Project Data<br />
          <p>
            <DataExportButton
              project={@props.project}
              buttonKey="projectDetails.classificationExport"
              exportType="classifications_export"  />
          </p>
          <p>
            <DataExportButton
              project={@props.project}
              buttonKey="projectDetails.subjectExport"
              exportType="subjects_export"  />
          </p>
          <p>
            <DataExportButton
              project={@props.project}
              buttonKey="projectDetails.workflowExport"
              exportType="workflows_export"  />
          </p>
          <p>
            <DataExportButton
              project={@props.project}
              buttonKey="projectDetails.workflowContentsExport"
              exportType="workflow_contents_export"  />
          </p>
          <hr />

          Talk Data<br />
          <p>
            <TalkDataExportButton
              project={@props.project}
              exportType="comments"
              label="Request new Talk comments export" />
          </p>
          <p>
            <TalkDataExportButton
              project={@props.project}
              exportType="tags"
              label="Request new Talk tags export" />
          </p>
        </div>
      </div>
    </div>
