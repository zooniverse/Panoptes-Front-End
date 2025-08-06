/*
Check Is Workflow Valid for Batch Aggregations Data Export
This function checks if it's OK to ask for a batch aggregations data export for
a given workflow.

Criteria for a valid workflow:
- workflow contains 1 or more Tasks of ANY of the following types: single (aka
  "single answer question"), survey
- workflow contains 0 Tasks of any OTHER type.

Input:
- workflow (Panoptes Workflow Resource)

Output:
- true if the workflow meets all criteria.
- false otherwise.
 */

export default function checkIsWorkflowValid (workflow) {
  if (!workflow) return false;

  const VALID_TASK_TYPES = ['single', 'survey'];
  let countOfValidTasks = 0;
  let countOfInvalidTasks = 0;

  Object.values(workflow.tasks || {}).forEach(task => {
    if (VALID_TASK_TYPES.includes(task.type)) {
      countOfValidTasks++;
    } else {
      countOfInvalidTasks++;
    }
  });

  return countOfValidTasks >= 1 && countOfInvalidTasks === 0;

}