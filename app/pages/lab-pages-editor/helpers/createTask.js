/*
Creates an empty/placeholder Task that's ready to be inserted into a Workflow.
NOTE: the Task Key isn't handled by this function. Whatever's calling this
function needs to assign the appropriate Task Key to this Task, and then add it
to the Workflow.
 */

import tasks from '../../../classifier/tasks';

export default function createTask(taskType) {
  return tasks[taskType]?.getDefaultTask();
}
