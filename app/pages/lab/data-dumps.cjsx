React = require 'react'
createReactClass = require 'create-react-class'
counterpart = require 'counterpart'
DataExportButton = require '../../partials/data-export-button'
TalkDataExportButton = require '../../talk/data-export-button'
`import WorkflowClassificationExportButton from './workflow-classification-export-button';`
Dialog = require 'modal-form/dialog'

counterpart.registerTranslations 'en',
  projectDetails:
    classificationExport: "Request new classification export"
    subjectExport: "Request new subject export"
    workflowExport: "Request new workflow export"
    workflowContentsExport: "Request new workflow contents export"
    commentsExport: "Request new talk comments export"
    tagsExport: "Request new talk tags export"

module.exports = createReactClass
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
      <p className="form-help">
        Please note that the Zooniverse will process at most 1 of each
        export within a 24 hour period and some exports may take a
        long time to process. We will email you when they are ready.
      </p>
      <p className="form-help">
        For examples of how to work with the data exports, see our&nbsp
        <a href="https://github.com/zooniverse/Data-digging">
          Data Digging code repository
        </a> or use our&nbsp
        <a href="https://github.com/zooniverse/aggregation-for-caesar">
          Panoptes Aggregation python package
        </a>.
      </p>
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
            <WorkflowClassificationExportButton project={@props.project} />
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
