/*
Workflows Export Checker
A simple information component that displays the status of the project's
Workflows Export.

- Uh, doesn't actually check for anything - that's done in a parent component.
  Maybe this should be renamed WorkflowsExportDisplay.

Component Props:
- status: string indicating the status of the data fetching process.
- workflowsExport: the Workflows Export data. (Panoptes Data Export Resource)
 */

function WorkflowsExportChecker ({
  workflowsExport,
  status
}) {
  const workflowsExportUpdatedAt = workflowsExport ? new Date(workflowsExport.updated_at) : null;

  return (
    <div className="workflows-export-checker">
      {status === 'fetching' && (
        <span
          aria-label="Fetching..."
          className="fa fa-spinner fa-spin"
        />
      )}
      {status === 'success' && workflowsExport && (
        <>
          <p className="bold">
            <span className="fa fa-check-circle-o" />
            <span>Use the last export, generated {workflowsExportUpdatedAt?.toLocaleString()}.</span>
          </p>
          <p>
            <span className="fa fa-info-circle" />
            <span>Want to include a newer export? Exit this configuration and generate a new Workflow export on the Data Exports tab of the Project Builder.</span>
          </p>
        </>
      )}
      {status === 'no-data' && (
        <>
          <p className="bold warning">
            <span className="fa fa-exclamation-triangle" />
            <span>No export has been generated.</span>
          </p>
          <p>
            A workflow export is necessary to generate a batch aggregation. Exit this configuration and generate a new a <b>Workflows</b> export first.
          </p>
        </>
      )}
    </div>
  );
}

export default WorkflowsExportChecker;