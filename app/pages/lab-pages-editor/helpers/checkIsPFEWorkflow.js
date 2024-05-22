/*
Checks if a workflow is a PFE workflow, as opposed to an FEM workflow.
Quite simply, a workflow designed for the PFE classifier has tasks, but NO
steps/pages. A workflow designed for the FEM classifier has tasks AND steps.

- If a workflow has neither tasks nor steps, it's uninitialised.
- If a workflow has no tasks, but has steps, then it's an anomaly.
 */

export default function checkIsPFEWorkflow(workflow) {
  if (!workflow) return false;

  const tasks = workflow?.tasks || {};
  const steps = workflow?.steps || [];

  return Object.keys(tasks).length > 0 && steps.length === 0;
}