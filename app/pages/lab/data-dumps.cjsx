React = require 'react'
counterpart = require 'counterpart'
DataExportButton = require '../../partials/data-export-button'
TalkDataExportButton = require '../../talk/data-export-button'
`import WorkflowClassificationExportButton from './workflow-classification-export-button';`
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
    showAggregationExportButton: false

  componentDidMount: ->
    @showAggregationExport @props.project

  showWorkflowExport: ->
    Dialog.alert(
      <ExportWorkflowsDialog project={@props.project} />
    )

  showAggregationExport: (project) ->
    project.get('aggregations_export').then (export) =>
      if export[0].metadata.state is 'ready'
        @setState showAggregationExportButton: true
    .catch (error) =>
      console.error error

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
          {
            if "export classifications by workflow" in @props.project.experimental_tools
              <div className="row">
                <WorkflowClassificationExportButton project={@props.project} />
              </div>
          }
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
          {
           if @state.showAggregationExportButton
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
          }
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
