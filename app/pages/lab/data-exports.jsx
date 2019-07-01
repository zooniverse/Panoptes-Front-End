import counterpart from 'counterpart';
import PropTypes from 'prop-types';
import React from 'react';
import { Markdown } from 'markdownz';

import { projectsWithWarnings } from './data-exports-warnings'
import WorkflowClassificationExportButton from './workflow-classification-export-button';
import DataExportButton from  '../../partials/data-export-button';
import TalkDataExportButton from  '../../talk/data-export-button';
import DataExportDownloadLink from '../../partials/data-export-download-link';

counterpart.registerTranslations('en', {
  projectDetails: {
    classificationExport: 'Request new classification export',
    subjectExport: 'Request new subject export',
    workflowExport: 'Request new workflow export',
    commentsExport: 'Request new talk comments export',
    tagsExport: 'Request new talk tags export',
  }
});

export default function DataExports (props) {
  const warningsForProject = getWarningsForProject(props.project.id, props.warnings)
  console.info(warningsForProject)
  return (
    <div className="data-exports">
      <p className="form-label">Project data exports</p>
      <p className="form-help">
        Please note some exports may take a long time to process. We will email you when they are ready. You can only request one of each export within a 24-hour time period.
      </p>
      <p className="form-help">
        For examples of how to work with the data exports, see our&nbsp;
        <a href="https://github.com/zooniverse/Data-digging">
          Data Digging code repository
        </a> or use our&nbsp;
        <a href="https://github.com/zooniverse/aggregation-for-caesar">
          Panoptes Aggregation python package
        </a>.
      </p>
      <div>
        {(warningsForProject.length > 0) && warningsForProject.map(warning =>
          <Warning key={warning} text={warning} />
        )}
      </div>
      <div className="columns-container">
        <div>
          <h4>Project Data</h4>

          <div className="row">
            <DataExportButton
              project={props.project}
              buttonKey="projectDetails.classificationExport"
              exportType="classifications_export"
            />
          </div>
          <div className="row">
            <WorkflowClassificationExportButton project={props.project} />
          </div>
          <div className="row">
            <DataExportButton
              project={props.project}
              buttonKey="projectDetails.subjectExport"
              exportType="subjects_export"
            />
          </div>
          <div className="row">
            <DataExportButton
              project={props.project}
              buttonKey="projectDetails.workflowExport"
              exportType="workflows_export"
            />
          </div>
          <div className="row">
            <p>
              <strong>Workflow contents export: </strong>
              <DataExportDownloadLink 
                project={props.project} 
                exportType="workflow_contents_export" />
              {' '}
              This export can no longer be generated. We've generated one just prior to disabling the generation. The workflow contents exports have been merged into the normal workflow export. The "strings" column is now available directly in the workflows export, and the "version" column from the workflow contents export is called "minor_version" in the workflows export. This means you no longer need to look up rows from two files in order to know what the actual setup of the workflow was for the version number specified by a classification.
            </p>
          </div>
          <hr />

          <h4>Talk Data</h4>
          <div className="row">
            <TalkDataExportButton
              project={props.project}
              exportType="comments"
              label="Request new Talk comments export"
            />
          </div>
          <div className="row">
            <TalkDataExportButton
              project={props.project}
              exportType="tags"
              label="Request new Talk tags export"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

DataExports.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  warnings: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
    projects: PropTypes.arrayOf(PropTypes.string)
  }))
}

DataExports.defaultProps = {
  warnings: projectsWithWarnings
}

export function Warning({ text }) {
  return (
    <Markdown tag='section' className="data-export-warning">
      {text}
    </Markdown>
  )
}

function getWarningsForProject(currentProjectId, warnings) {
  return warnings
    .map(bug => bug.projects.includes(currentProjectId)
        ? bug.message
        : null
    )
    .filter(warning => warning)
}
