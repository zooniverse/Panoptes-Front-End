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
        <p>🔄 Checking...</p>
      )}
      {status === 'success' && workflowsExport && (
        <>
          <p>✅ Use the last export, generated {workflowsExportUpdatedAt?.toLocaleString()}</p>
          <p>ℹ️ Want to include a newer export? Exit this configuration and generate a new Workflows export on the Data Exports tab of the Project Builder.</p>
        </>
      )}
      {status === 'no-data' && (
        <>
          <p>❌ No workflow export has been generated.</p>
          <p>A workflow export is necessary to generate a batch aggregation. Exit this configuration and generate a new a Workflows export first.</p>
        </>
      )}
    </div>
  );
}

export default WorkflowsExportChecker;