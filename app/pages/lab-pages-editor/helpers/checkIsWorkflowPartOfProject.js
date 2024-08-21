/*
Checks if a workflow belongs to a project.
 */

export default function checkIsWorkflowPartOfProject(workflow, project) {
  if (!workflow || !project) return false;
  return !!project.links?.workflows?.includes(workflow.id);
}