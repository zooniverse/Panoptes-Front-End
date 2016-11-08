React = require 'react'
counterpart = require 'counterpart'
DataExportButton = require '../../partials/data-export-button'
TalkDataExportButton = require '../../talk/data-export-button'
ExportWorkflowsDialog = require('../../partials/export-workflows-dialog').default
Dialog = require 'modal-form/dialog'

counterpart.registerTranslations 'en',
  projectDetails:
    classificationExport: "Request new classification export"
    aggregationExport: "Experimental - Request new aggregation export"
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

  showWorkflowExport: ->
    Dialog.alert(
      <ExportWorkflowsDialog project={@props.project} />
    )

  render: ->
    <div className="data-exports">
      <p className="form-label">Project data exports</p>
      <p className="form-help">Please note that the Zooniverse will process at most 1 of each export within a 24 hour period and some exports may take a long time to process. We will email you when they are ready.</p>
      <div className="columns-container">
        <div>
          Project Data<br />
          <div className="row">
            <DataExportButton
              project={@props.project}
              buttonKey="projectDetails.classificationExport"
              exportType="classifications_export"  />
          </div>
          <div className="row">
            <button onClick={@showWorkflowExport}>Request new workflow classification export</button>
            <small className="form-help"> CSV format.</small>
          </div>
          <div className="row">
            <DataExportButton
              project={@props.project}
              buttonKey="projectDetails.subjectExport"
              exportType="subjects_export"  />
          </div>
          <div className="row">
            <DataExportButton
              project={@props.project}
              buttonKey="projectDetails.workflowExport"
              exportType="workflows_export"  />
          </div>
          <div className="row">
            <DataExportButton
              project={@props.project}
              buttonKey="projectDetails.workflowContentsExport"
              exportType="workflow_contents_export"  />
          </div>
           <div className="row">
            <DataExportButton
              project={@props.project}
              buttonKey="projectDetails.aggregationExport"
              contentType="application/x-gzip"
              exportType="aggregations_export"
              newFeature=true
            />
            <small className="form-help">Text tasks and survey tasks cannot be aggregated at this time.</small>
          </div>
          <hr />

          Talk Data<br />
          <div className="row">
            <TalkDataExportButton
              project={@props.project}
              exportType="comments"
              label="Request new Talk comments export" />
          </div>
          <div className="row">
            <TalkDataExportButton
              project={@props.project}
              exportType="tags"
              label="Request new Talk tags export" />
          </div>
        </div>
      </div>
    </div>
