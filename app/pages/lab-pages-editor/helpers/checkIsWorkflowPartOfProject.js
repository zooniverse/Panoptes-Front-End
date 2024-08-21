/*
Checks if a workflow belongs to a project.
 */

export default function checkIsWorkflowPartOfProject(workflow, project) {
  if (!workflow || !project) return false;
  return !!workflow.links?.subject_sets?.some(sset => project.links?.subject_sets?.includes(sset));
}